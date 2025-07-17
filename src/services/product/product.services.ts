import { TWarehousePayload } from '~/services/warehouse/type'
import { ObjectId } from 'mongodb'
import { PRODUCT_MESSAGES } from '~/constants/message'
import { BadRequestError, ConflictRequestError, InternalServerError, NotFoundError } from '~/models/errors/errors'
import Product from '~/models/schemas/products/products.schemas'
import databaseService from '~/services/database/database.services'
import { TProductPayload, TProductQuery, TUpdateProductPayload } from '~/services/product/type'
import warehouseServices from '~/services/warehouse/warehouse.services'
import { TProductProps } from '~/models/schemas/products/type'
import categoryServices from '~/services/category/category.services'
import brandServices from '~/services/brand/brand.services'
import imagesService from '~/services/images/images.services'

class ProductServices {
  async checkProductByName(name: string) {
    const result = await databaseService.products.findOne({ name })
    if (result) {
      throw new ConflictRequestError({ message: PRODUCT_MESSAGES.PRODUCT_EXISTS })
    }
  }

  async createProduct({
    thumbnail,
    description,
    featured,
    attributes,
    name,
    minimum_stock,
    category_id,
    brand_id,
    variants
  }: TProductPayload) {
    const product_id = new ObjectId()
    await Promise.all([
      this.checkProductByName(name),
      categoryServices.getCategoryById(category_id),
      brandServices.getBrandById(brand_id)
    ])

    variants.forEach((item) => ((item._id = new ObjectId()), (item.sold = 0)))

    const product = new Product({
      _id: product_id,
      name,
      category_id: new ObjectId(category_id),
      brand_id: new ObjectId(brand_id),
      description,
      featured,
      rate: 0,
      thumbnail,
      variants,
      attributes,
      minimum_stock
    })

    const result = await databaseService.products.insertOne(product)
    if (!result.acknowledged || !result.insertedId) {
      throw new InternalServerError()
    }

    let warehousePayload = {} as TWarehousePayload
    for (const item of variants) {
      warehousePayload = {
        product_id: product_id.toString(),
        product_name: name,
        variant: item.color,
        variant_id: item._id.toString(),
        import_quantity: item.stock,
        minimum_stock,
        shipments: [
          {
            shipment_date: new Date(),
            quantity: item.stock
          }
        ]
      }
      await warehouseServices.createWarehouse(warehousePayload)
    }

    return this.getProductById(product_id.toString())
  }

  async getProduct(queryProduct: TProductQuery) {
    // Parse query parameters
    const options = {
      page: queryProduct.page ? Number(queryProduct.page) : null,
      limit: queryProduct.limit ? Number(queryProduct.limit) : null,
      orderBy: queryProduct.orderBy as string,
      order: queryProduct.order ? Number(queryProduct.order) : null,
      dateFrom: queryProduct.dateFrom as string,
      dateTo: queryProduct.dateTo as string,
      search: queryProduct.search as string,
      category: queryProduct.category as string,
      popular: queryProduct.popular === 'true',
      onSale: queryProduct.onSale === 'true',
      topRated: queryProduct.topRated === 'true',
      minPrice: queryProduct.minPrice ? Number(queryProduct.minPrice) : null,
      maxPrice: queryProduct.maxPrice ? Number(queryProduct.maxPrice) : null,
      outOfStockLimit: queryProduct.outOfStockLimit === 'true',
      inStock: queryProduct.inStock === 'true'
    }

    const {
      page,
      limit,
      orderBy,
      order,
      dateFrom,
      dateTo,
      search,
      category,
      popular,
      onSale,
      topRated,
      minPrice,
      maxPrice,
      outOfStockLimit,
      inStock
    } = options

    const query: any = {}

    // Filter logic
    if (dateFrom || dateTo) {
      query.created_at = {}
      if (dateFrom) query.created_at.$gte = new Date(dateFrom)
      if (dateTo) query.created_at.$lte = new Date(dateTo)
    }

    // option i tìm kiếm không phân biệt chữ hoa chữ thường (case-insensitive)
    if (search) {
      query.name = {
        $regex: search,
        $options: 'i'
      }
    }

    if (category) {
      query.category_id = new ObjectId(category)
    }

    if (popular) {
      query['featured.isPopular'] = popular
    }

    if (onSale) {
      query['featured.onSale'] = onSale
    }

    if (topRated) {
      query['featured.isRated'] = topRated
    }

    if (outOfStockLimit) {
      query['variants.stock'] = { $lt: 10 }
    }

    if (inStock) {
      query['variants.stock'] = { $gt: 10 }
    }

    // Sorting logic
    const sort: any = {}
    if (orderBy) {
      if (orderBy === 'price') {
        sort['firstVariantPrice'] = order
      } else if (orderBy === 'rate') {
        sort.rate = order
      } else {
        sort[orderBy] = order
      }
    } else {
      sort.created_at = -1
    }

    // Pagination and fetching data
    if (page && limit) {
      const skip = (page - 1) * limit

      const products = await databaseService.products
        .aggregate([
          { $match: query },
          {
            $addFields: {
              firstVariantPrice: {
                // multi nhân các giá trị bên trong mảng
                $multiply: [
                  // Lấy price của phần tử đầu tiên 0
                  { $arrayElemAt: ['$variants.price', 0] },
                  // Thực hiện trừ giữa 1 và discount của phần tử đầu tiên 0
                  { $subtract: [1, { $arrayElemAt: ['$variants.discount', 0] }] }
                ]
              }
            }
          },
          // Lọc theo minPrice và maxPrice nếu có
          ...(minPrice || maxPrice
            ? [
                {
                  $match: {
                    firstVariantPrice: {
                      ...(minPrice !== undefined ? { $gte: minPrice } : {}),
                      ...(maxPrice !== undefined ? { $lte: maxPrice } : {})
                    }
                  }
                }
              ]
            : []),
          { $sort: sort },
          { $skip: skip },
          { $limit: limit }
        ])
        .toArray()
      const totalProductsPipeline = [
        { $match: query },
        {
          $addFields: {
            firstVariantPrice: {
              $multiply: [
                { $arrayElemAt: ['$variants.price', 0] },
                { $subtract: [1, { $arrayElemAt: ['$variants.discount', 0] }] }
              ]
            }
          }
        },
        ...(minPrice || maxPrice
          ? [
              {
                $match: {
                  firstVariantPrice: {
                    ...(minPrice !== undefined ? { $gte: minPrice } : {}),
                    ...(maxPrice !== undefined ? { $lte: maxPrice } : {})
                  }
                }
              }
            ]
          : [])
      ]
      const totalProducts = await databaseService.products
        .aggregate([...totalProductsPipeline, { $count: 'count' }])
        .toArray()

      const totalProductCount = totalProducts[0]?.count || 0
      const totalPages = Math.ceil(totalProductCount / limit)

      return {
        products,
        pagination: {
          totalProducts: totalProductCount,
          totalPages,
          currentPage: page,
          limit
        }
      }
    } else {
      // If no pagination, return all products
      const products = await databaseService.products
        .aggregate([
          { $match: query },
          {
            $addFields: {
              firstVariantPrice: {
                $multiply: [
                  { $arrayElemAt: ['$variants.price', 0] },
                  { $subtract: [1, { $arrayElemAt: ['$variants.discount', 0] }] }
                ]
              }
            }
          },
          // Lọc theo minPrice và maxPrice nếu có
          ...(minPrice || maxPrice
            ? [
                {
                  $match: {
                    firstVariantPrice: {
                      ...(minPrice !== undefined ? { $gte: minPrice } : {}),
                      ...(maxPrice !== undefined ? { $lte: maxPrice } : {})
                    }
                  }
                }
              ]
            : []),
          { $sort: sort }
        ])
        .toArray()

      return { products }
    }
  }

  async checkProductInOrder(productId: string) {
    //Product in order status pending
    const productExist = await databaseService.orders.findOne({
      'products.product_id': new ObjectId(productId),
      status: 0
    })
    if (productExist) {
      throw new BadRequestError({ message: PRODUCT_MESSAGES.PRODUCT_EXISTS_ORDER })
    }
  }

  async checkProductandVariant(productId: string, variantId: string, quantity?: number) {
    const productExist = await this.getProductById(productId)
    const variantExist = productExist.variants.find((item) => item._id.toString() === variantId)
    if (!variantExist) {
      throw new NotFoundError({ message: PRODUCT_MESSAGES.VARIANT_NOT_EXISTS })
    }
    if (quantity) {
      if (variantExist.stock < quantity) {
        throw new BadRequestError()
      }
    }
  }

  async getProductById(productId: string) {
    const result = (await databaseService.products.findOne({ _id: new ObjectId(productId) })) as TProductProps
    if (!result) {
      throw new NotFoundError()
    }
    return result
  }

  async checkProductByBrand(brandId: string) {
    const productExist = await databaseService.products.findOne({ brand_id: new ObjectId(brandId) })
    if (productExist) {
      return true
    }
    return false
  }

  async checkProductByCategory(categoryId: string) {
    const productExist = await databaseService.products.findOne({ category_id: new ObjectId(categoryId) })
    if (productExist) {
      return true
    }
    return false
  }

  async updateProduct(productId: string, payload: TUpdateProductPayload) {
    // Check product exist
    const product = await this.getProductById(productId)

    // Check product exist in order with status pending
    await this.checkProductInOrder(productId)

    const category_id = new ObjectId(payload.category_id)
    const brand_id = new ObjectId(payload.brand_id)
    // Check exist category and brand
    await Promise.all([
      categoryServices.getCategoryById(payload.category_id),
      brandServices.getBrandById(payload.brand_id)
    ])

    // Check stock variant must be large minimum stock
    const checkMinimumStock = payload.variants?.some((item) => item.stock <= payload.minimum_stock!)
    if (checkMinimumStock) {
      throw new BadRequestError({ message: PRODUCT_MESSAGES.VARIANT_STOCK_MINIMUM_STOCK })
    }

    // Delete images
    if (product.thumbnail !== payload.thumbnail) {
      await imagesService.deleteImage(product.thumbnail)
    }
    if (payload.variants.length > 0) {
      // flatMap return Array not nested
      const oldVariantImages = product.variants.flatMap((variant) => variant.images)
      const newVariantImages = payload.variants.flatMap((variant) => variant.images)
      const imagesToDelete = oldVariantImages.filter((image) => !newVariantImages.includes(image))
      if (imagesToDelete.length > 0) {
        await Promise.all(imagesToDelete.map((image) => imagesService.deleteImage(image)))
      }
    }

    // Remove product had been updated in cart users
    await databaseService.carts.updateMany(
      {
        'products.product_id': new ObjectId(productId)
      },
      {
        $pull: {
          products: { product_id: new ObjectId(productId) }
        }
      }
    )

    // Add field _id for variant item
    payload.variants = payload.variants?.map((variant) => ({
      ...variant,
      _id: new ObjectId(variant._id) || new ObjectId()
    }))

    const variantIdsInPayload = payload.variants?.map((variant) => new ObjectId(variant._id)) || []
    const currentWarehouses = await databaseService.warehouse.find({ product_id: new ObjectId(productId) }).toArray()

    for (const variant of payload.variants) {
      const existingWarehouse = currentWarehouses.find((warehouse) =>
        warehouse.variant_id.equals(new ObjectId(variant._id))
      )
      if (existingWarehouse) {
        // Update with old variant
        await databaseService.warehouse.updateOne(
          { _id: existingWarehouse._id, isDeleted: false },
          {
            $set: {
              minimum_stock: payload.minimum_stock,
              product_name: payload.name,
              variant: variant.color,
              updated_at: new Date()
            }
          }
        )
      } else {
        //Add with new variant
        const resultInsert = await databaseService.warehouse.insertOne({
          product_id: new ObjectId(productId),
          product_name: payload.name,
          variant: variant.color,
          variant_id: new ObjectId(variant._id),
          minimum_stock: payload.minimum_stock!,
          sold: 0,
          stock: variant.stock,
          shipments: [
            {
              shipment_date: new Date(),
              quantity: variant.stock
            }
          ],
          import_quantity: variant.stock,
          created_at: new Date(),
          updated_at: new Date(),
          isDeleted: false
        })

        if (!resultInsert.acknowledged) {
          throw new InternalServerError()
        }
      }
    }

    //Mark isDeleted true for variant had been deleted
    const variantIdsToDelete = currentWarehouses
      .filter((warehouse) => !variantIdsInPayload.some((id) => id.equals(warehouse.variant_id)))
      .map((warehouse) => warehouse._id)

    if (variantIdsToDelete.length > 0) {
      const resultMarkDeleted = await databaseService.warehouse.updateMany(
        { _id: { $in: variantIdsToDelete } },
        { $set: { isDeleted: true, updated_at: new Date() } }
      )

      if (!resultMarkDeleted.acknowledged) {
        throw new InternalServerError()
      }
    }

    // Update product
    const result = await databaseService.products.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { ...payload, category_id, brand_id, updated_at: new Date() } }
    )

    if (!result.acknowledged || !result.modifiedCount) {
      throw new InternalServerError()
    }

    return await this.getProductById(productId)
  }

  async updateRateProduct(productId: string, rate: number) {
    const product = await this.getProductById(productId)
    const calculateRate = Math.round((product.rate + rate) / 2)
    const result = await databaseService.products.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { rate: calculateRate, updated_at: new Date(), 'featured.isRated': calculateRate >= 4 ? true : false } }
    )
    if (!result.acknowledged) {
      throw new InternalServerError()
    }

    return await this.getProductById(productId)
  }

  async deleteProduct(productId: string) {
    const product = await this.getProductById(productId)
    await this.checkProductInOrder(productId)
    await Promise.all([
      imagesService.deleteImage(product.thumbnail),
      product.variants.map((variant) => imagesService.deleteImage(variant.images)),
      databaseService.products.deleteOne({ _id: new ObjectId(productId) }),
      warehouseServices.updateIsDeleted(productId),
      databaseService.carts.updateMany(
        { 'products.product_id': new ObjectId(productId) },
        { $pull: { products: { product_id: new ObjectId(productId) } } }
      ),
      databaseService.wishlist.updateMany(
        {
          'list_item.product_id': new ObjectId(productId)
        },
        { $pull: { list_item: { product_id: new ObjectId(productId) } } }
      )
    ])
  }
}
const productServices = new ProductServices()
export default productServices
