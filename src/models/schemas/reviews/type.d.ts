import { ObjectId } from 'mongodb'

export type TReviews = {
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
}
