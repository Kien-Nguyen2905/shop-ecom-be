import { ObjectId } from 'mongodb'
import { BadRequestError, InternalServerError, NotFoundError } from '~/models/errors/errors'
import { TCart } from '~/models/schemas/carts/type'
import { TRemoveItemCartPayload, TUpdateCartPayload } from '~/services/cart/type'
import databaseService from '~/services/database/database.services'
import productServices from '~/services/product/product.services'

class CartServices {
  async getCart(id: string) {
    return ((await databaseService.carts.findOne({ user_id: new ObjectId(id) })) as TCart) || {}
  }

  async updateCart({ product_id, variant_id, quantity, user_id }: TUpdateCartPayload) {
    //Check quantity with variant stock
    await productServices.checkProductandVariant(product_id, variant_id, quantity)

    const product = await productServices.getProductById(product_id)

    const variant = product.variants.find((item) => item._id.toString() === variant_id)
    if (!variant) {
      throw new BadRequestError()
    }

    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng hay chưa
    const cart = await databaseService.carts.findOne({ user_id: new ObjectId(user_id) })
    if (!cart) {
      throw new NotFoundError()
    }

    const existingProductIndex = cart.products?.findIndex(
      (product) =>
        product.product_id.equals(new ObjectId(product_id)) && product.variant_id.equals(new ObjectId(variant_id))
    )
    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã tồn tại, cập nhật lại thông tin
      cart.products![existingProductIndex!].quantity = quantity
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
      cart.products!.push({
        product_id: new ObjectId(product_id),
        variant_id: new ObjectId(variant_id),
        name: product.name,
        price: variant?.price,
        quantity,
        image: product.thumbnail,
        color: variant?.color,
        discount: variant?.discount
      })
    }
    // Cập nhật giỏ hàng trong cơ sở dữ liệu
    await databaseService.carts.updateOne(
      { user_id: new ObjectId(user_id) },
      {
        $set: {
          products: cart.products,
          updated_at: new Date()
        }
      }
    )
    return await this.getCart(user_id)
  }

  async removeCart({ user_id, item_id }: TRemoveItemCartPayload) {
    const cart = await databaseService.carts.findOne({ user_id: new ObjectId(user_id) })
    if (!cart) {
      throw new NotFoundError()
    }
    const result = await databaseService.carts.updateOne(
      {
        user_id: new ObjectId(user_id)
      },
      {
        $pull: {
          products: { variant_id: new ObjectId(item_id) }
        },
        $set: {
          updated_at: new Date()
        }
      }
    )
    if (!result.modifiedCount && !result.acknowledged) {
      throw new InternalServerError()
    }
    return (await this.getCart(user_id)) || {}
  }
}

const cartServices = new CartServices()
export default cartServices
