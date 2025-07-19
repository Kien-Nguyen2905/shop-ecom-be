import { ObjectId } from 'mongodb'
import { STATUS_ORDER, STATUS_TRANSACTION, TYPE_PAYMENT } from '~/constants/enum'
import { BadRequestError, InternalServerError, NotFoundError } from '~/models/errors/errors'
import Order from '~/models/schemas/orders/orders.schemas'
import { TOrderProps } from '~/models/schemas/orders/type'
import Transaction from '~/models/schemas/transactions/transactions.schemas'
import cartServices from '~/services/cart/cart.services'
import databaseService from '~/services/database/database.services'
import {
  TCreateOrderPayload,
  TFindVariantUnreview,
  TProductOrder,
  TUpdateStatusOrderPayload
} from '~/services/order/type'
import productServices from '~/services/product/product.services'
import userServices from '~/services/user/users.services'

class OrderService {
  async checkStockAvailability(products: TProductOrder[]) {
    for (let product of products) {
      const warehouseItem = await databaseService.warehouse.findOne({
        product_id: new ObjectId(product.product_id),
        variant_id: new ObjectId(product.variant_id)
      })
      if (!warehouseItem) {
        throw new BadRequestError()
      }

      if (product.quantity > warehouseItem.stock!) {
        throw new BadRequestError({
          message: `Insufficient stock for product "${warehouseItem.product_name}" with variant "${warehouseItem.variant}" Available: ${warehouseItem.stock}.`
        })
      }
    }
  }

  private calculateTotal(products: any[], earn_point?: number) {
    let total = products.reduce((total, item) => {
      const currentPrice = item.price * item.quantity
      const discount = currentPrice * (1 - item.discount)
      return total + discount
    }, 0)

    // Subtract earned points
    if (earn_point) {
      total -= earn_point * 1000
    }

    return total
  }

  private createProductEntities(products: any[]) {
    return products.map((product) => ({
      ...product,
      _id: new ObjectId(),
      product_id: new ObjectId(product.product_id),
      variant_id: new ObjectId(product.variant_id),
      isReviewed: false
    }))
  }

  private createTransaction(
    orderId: ObjectId,
    user_id: string,
    total: number,
    type_payment: TYPE_PAYMENT,
    content?: string
  ) {
    const method_payment = type_payment === TYPE_PAYMENT.COD ? 'COD' : 'BANKING'
    const status = type_payment === TYPE_PAYMENT.COD ? STATUS_TRANSACTION.SUCCESS : STATUS_TRANSACTION.PENDING
    const transactionData: any = {
      order_id: orderId,
      user_id: new ObjectId(user_id),
      method_payment,
      status,
      type_payment,
      value: total
    }

    if (type_payment !== TYPE_PAYMENT.COD) {
      transactionData.content = content
    }

    return new Transaction(transactionData)
  }

  private async updateWarehouseStock(products: any[], accepted: boolean = false) {
    await Promise.all(
      products.map(async (product) => {
        const variantId = product.variant_id
        const quantitySold = accepted ? product.quantity : -product.quantity
        const warehouseItem = await databaseService.warehouse.findOne({ variant_id: new ObjectId(variantId) })

        if (warehouseItem) {
          const updatedSold = warehouseItem.sold! + quantitySold
          const updatedStock = warehouseItem.stock! - quantitySold

          await databaseService.warehouse.updateOne(
            { variant_id: new ObjectId(variantId) },
            { $set: { sold: updatedSold, stock: updatedStock, updated_at: new Date() } }
          )
        }
      })
    )
  }

  private async updateUserCart(user_id: string, orderedProducts: any[]) {
    const cart = await cartServices.getCart(user_id)
    if (!cart) throw new NotFoundError()

    const productNotOrder = cart.products?.filter(
      (item) =>
        !orderedProducts.some(
          (orderItem) =>
            item.product_id.toString() === orderItem.product_id && item.variant_id.toString() === orderItem.variant_id
        )
    )

    const result = await databaseService.carts.updateOne(
      { user_id: new ObjectId(user_id) },
      { $set: { products: productNotOrder, updated_at: new Date() } }
    )

    if (!result.acknowledged || !result.modifiedCount) {
      throw new InternalServerError()
    }
  }

  private async updateUserProfile(user_id: string, earn_point: number) {
    const resultOrder = await this.getOrderByUser(user_id)
    await userServices.updateProfile({
      user_id,
      earn_point: -earn_point!,
      total_order: resultOrder.length
    })
  }

  async updateStockandSoldProduct({ products, reject = false }: { products: any; reject?: boolean }) {
    for (let product of products) {
      const resultProduct = await databaseService.products.updateOne(
        {
          _id: new ObjectId(product.product_id),
          'variants._id': new ObjectId(product.variant_id)
        },
        {
          $inc: {
            'variants.$.stock': reject ? product.quantity : -product.quantity,
            'variants.$.sold': reject ? -product.quantity : product.quantity
          },
          $set: {
            updated_at: new Date()
          }
        }
      )
      if (!resultProduct.acknowledged || !resultProduct.modifiedCount) {
        throw new InternalServerError()
      }
    }
  }

  async createOrder({
    user_id,
    products,
    address,
    note,
    type_payment,
    earn_point,
    phone,
    content
  }: TCreateOrderPayload) {
    // Check quantity in stock
    await this.checkStockAvailability(products)

    // Check product_id and variant_id exist
    await Promise.all(products.map((item) => productServices.checkProductandVariant(item.product_id, item.variant_id)))

    // Calculate total order amount
    let total = this.calculateTotal(products, earn_point)

    // Declare product entity with necessary mappings
    const productEntity = this.createProductEntities(products)

    // Create order
    const orderId = new ObjectId()
    const order = new Order({
      _id: orderId,
      user_id: new ObjectId(user_id),
      products: productEntity,
      address: address!,
      note,
      total,
      earn_point: earn_point || 0,
      phone,
      status: STATUS_ORDER.PENDING,
      type_payment
    })

    const resultOrder = await databaseService.orders.insertOne(order)
    if (!resultOrder.acknowledged || !resultOrder.insertedId) {
      throw new InternalServerError()
    }

    // Create transaction
    const transaction = this.createTransaction(orderId, user_id, total, type_payment, content)
    const resultTransaction = await databaseService.transactions.insertOne(transaction)
    if (!resultTransaction.acknowledged || !resultTransaction.insertedId) {
      throw new InternalServerError()
    }

    // Update warehouse stock and sold quantities
    await this.updateWarehouseStock(products, true)

    // Update stock product
    await this.updateStockandSoldProduct({ products })

    // Remove ordered products from the user's cart
    await this.updateUserCart(user_id, products)

    // Update user's profile with total order count and earned points
    await this.updateUserProfile(user_id, earn_point || 0)

    return (await databaseService.orders.findOne({ _id: orderId })) || {}
  }

  async getOrder() {
    return (
      (
        await databaseService.orders.aggregate([
          {
            $lookup: {
              from: 'transactions',
              localField: '_id',
              foreignField: 'order_id',
              as: 'transaction'
            }
          },
          {
            $match: {
              $nor: [
                {
                  transaction: {
                    $elemMatch: { type_payment: TYPE_PAYMENT.BANKING, status: STATUS_TRANSACTION.PENDING }
                  }
                }
              ]
            }
          },
          {
            $sort: { updated_at: -1 }
          }
        ])
      ).toArray() || []
    )
  }

  async getOrderById(order_id: string) {
    const order = (await databaseService.orders.findOne({ _id: new ObjectId(order_id) })) as TOrderProps
    if (!order) {
      throw new NotFoundError()
    }
    return order
  }

  async updateOrder({ order_id, status }: TUpdateStatusOrderPayload) {
    const order = await this.getOrderById(order_id)

    const resultUpdateOrder = await databaseService.orders.updateOne(
      { _id: new ObjectId(order_id) },
      {
        $set: {
          status,
          updated_at: new Date()
        }
      }
    )
    if (!resultUpdateOrder.acknowledged || !resultUpdateOrder.modifiedCount) {
      throw new InternalServerError()
    }
    const user = await databaseService.users.findOne({ _id: order.user_id })
    if (status === STATUS_ORDER.ACCEPT) {
      if (user) {
        const newTotalPaid = (user.total_paid || 0) + order.total
        await databaseService.users.updateOne(
          { _id: order.user_id },
          {
            $set: {
              total_paid: newTotalPaid,
              updated_at: new Date()
            }
          }
        )
      }
    }
    // CANCEL AND RETURN FOR COD
    if (status === STATUS_ORDER.CANCEL || status === STATUS_ORDER.RETURN) {
      if (user) {
        await databaseService.users.updateOne(
          { _id: order.user_id },
          {
            $set: {
              total_order: (user.total_order || 0) - 1,
              updated_at: new Date()
            }
          }
        )
      }
      await databaseService.transactions.updateOne(
        { order_id: new ObjectId(order._id), type_payment: TYPE_PAYMENT.COD },
        {
          $set: {
            status: STATUS_TRANSACTION.FAIL,
            updated_at: new Date()
          }
        }
      )
      // Cập nhật warehouse với sold và stock
      this.updateWarehouseStock(order.products)

      // Cập nhật variant ở product với sold và stock
      await this.updateStockandSoldProduct({ products: order.products, reject: true })

      if (order.earn_point > 0) {
        await userServices.updateProfile({
          user_id: order.user_id.toString(),
          earn_point: order.earn_point!
        })
      }
    }

    return (await this.getOrderById(order_id)) || {}
  }

  async getOrderByUser(user_id: string) {
    return (
      (await databaseService.orders
        .aggregate([
          {
            $match: {
              user_id: new ObjectId(user_id)
            }
          },
          {
            $lookup: {
              from: 'transactions',
              localField: '_id',
              foreignField: 'order_id',
              as: 'transaction'
            }
          },
          {
            $sort: {
              created_at: -1
            }
          }
        ])
        .toArray()) || []
    )
  }

  async checkOrderUnreview({ order_id, variant_id }: TFindVariantUnreview) {
    const variantInOrder = await databaseService.orders.findOne({
      _id: new ObjectId(order_id),
      products: {
        $elemMatch: {
          variant_id: new ObjectId(variant_id),
          isReviewed: false
        }
      },
      status: STATUS_ORDER.ACCEPT
    })
    if (!variantInOrder) {
      throw new NotFoundError()
    }
  }

  async updateOrderReviewed(order_id: string, variant_id: string) {
    await this.getOrderById(order_id)

    const result = await databaseService.orders.updateOne(
      {
        _id: new ObjectId(order_id),
        products: {
          $elemMatch: {
            variant_id: new ObjectId(variant_id),
            isReviewed: false
          }
        },
        status: STATUS_ORDER.ACCEPT
      },
      {
        $set: {
          'products.$.isReviewed': true
        }
      }
    )

    if (!result.acknowledged || !result.modifiedCount) {
      throw new InternalServerError()
    }
  }

  // For customer
  async cancelOrder(order_id: string) {
    const order = await this.getOrderById(order_id)
    if (!order) {
      throw new BadRequestError()
    }
    if (order.status === STATUS_ORDER.PENDING) {
      this.updateWarehouseStock(order.products)

      await this.updateStockandSoldProduct({ products: order.products, reject: true })

      if (order.earn_point > 0) {
        await userServices.updateProfile({
          user_id: order.user_id.toString(),
          earn_point: order.earn_point!
        })
      }
      // Delete transaction
      await databaseService.transactions.deleteOne({ order_id: new ObjectId(order._id) })
      // Delete order
      await databaseService.orders.deleteOne({ _id: new ObjectId(order._id) })
    } else {
      throw new BadRequestError({ message: 'Order have been accepted' })
    }
  }
}

const orderServices = new OrderService()

export default orderServices
