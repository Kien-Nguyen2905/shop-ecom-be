import { ObjectId } from 'mongodb'
import { InternalServerError, NotFoundError } from '~/models/errors/errors'
import Review from '~/models/schemas/reviews/reviews.schemas'
import { TReviews } from '~/models/schemas/reviews/type'
import databaseService from '~/services/database/database.services'
import orderServices from '~/services/order/orders.services'
import productServices from '~/services/product/product.services'
import { TCreateReviewPayload } from '~/services/review/type'
import userServices from '~/services/user/users.services'

class ReviewServices {
  async getReview(search?: string) {
    const filter = search ? { 'product.name': { $regex: search, $options: 'i' } } : {}

    const reviews = await databaseService.reviews
      .aggregate([
        {
          $match: filter
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
        },
        {
          $unwind: { path: '$product', preserveNullAndEmptyArrays: true }
        },
        {
          $project: {
            _id: 1,
            user_id: 1,
            order_id: 1,
            product_id: 1,
            variant_id: 1,
            title: 1,
            description: 1,
            rate: 1,
            'user.email': 1,
            'user.full_name': 1,
            'user.phone': 1,
            'product.name': 1,
            'product.thumbnail': 1,
            variant: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$product.variants',
                    as: 'variant',
                    cond: { $eq: ['$$variant._id', '$variant_id'] }
                  }
                },
                0
              ]
            },
            created_at: 1,
            updated_at: 1
          }
        }
      ])
      .toArray()

    return reviews || []
  }

  async getReviewById(review_id: string) {
    return ((await databaseService.reviews.findOne({ _id: new ObjectId(review_id) })) as TReviews) || {}
  }

  async createReview({ user_id, order_id, product_id, variant_id, title, description, rate }: TCreateReviewPayload) {
    // check product and variant
    const productExist = await productServices.getProductById(product_id)
    const variantExist = productExist.variants.find((item) => item._id.toString() === variant_id)
    if (!variantExist) {
      throw new NotFoundError({ message: 'Product not exist!' })
    }
    // check review
    await orderServices.checkOrderUnreview({ order_id, variant_id })

    await userServices.updateProfile({ user_id, earn_point: 1 })
    const _id = new ObjectId()
    const review = new Review({
      _id,
      user_id: new ObjectId(user_id),
      order_id: new ObjectId(order_id),
      product_id: new ObjectId(product_id),
      variant_id: new ObjectId(variant_id),
      description,
      title,
      rate
    })
    const result = await databaseService.reviews.insertOne(review)
    if (!result.acknowledged || !result.insertedId) {
      throw new InternalServerError()
    }
    await orderServices.updateOrderReviewed(order_id, variant_id)
    await productServices.updateRateProduct(product_id, rate)
    return this.getReviewById(_id.toString())
  }

  async getReviewByProductId(product_id: string) {
    const reviews = await databaseService.reviews
      .aggregate([
        {
          $match: { product_id: new ObjectId(product_id) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
        },
        {
          $unwind: { path: '$product', preserveNullAndEmptyArrays: true }
        },
        {
          $project: {
            _id: 1,
            user_id: 1,
            order_id: 1,
            product_id: 1,
            variant_id: 1,
            title: 1,
            description: 1,
            rate: 1,
            'user.email': 1,
            'user.full_name': 1,
            'user.phone': 1,
            'product.name': 1,
            'product.thumbnail': 1,
            variant: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$product.variants',
                    as: 'variant',
                    cond: { $eq: ['$$variant._id', '$variant_id'] }
                  }
                },
                0
              ]
            },
            created_at: 1,
            updated_at: 1
          }
        }
      ])
      .toArray()
    return reviews
  }
}

const reviewServices = new ReviewServices()

export default reviewServices
