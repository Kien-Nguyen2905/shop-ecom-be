import { ObjectId } from 'mongodb'
import { TReviews } from '~/models/schemas/reviews/type'

export default class Review {
  _id?: ObjectId
  user_id: ObjectId
  order_id: ObjectId
  product_id: ObjectId
  variant_id: ObjectId
  title: string
  description: string
  rate: number
  created_at?: Date
  updated_at?: Date
  constructor(review: TReviews) {
    const date = new Date()
    this._id = review._id
    this.user_id = review.user_id
    this.order_id = review.order_id
    this.product_id = review.product_id
    this.variant_id = review.variant_id
    this.title = review.title
    this.description = review.description
    this.rate = review.rate
    this.created_at = review.created_at || date
    this.updated_at = review.updated_at || date
  }
}
