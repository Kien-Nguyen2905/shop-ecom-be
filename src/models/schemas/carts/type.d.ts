import { ObjectId } from 'mongodb'

export type TProductsCart = {
  product_id: ObjectId
  variant_id: ObjectId
  name: string
  image: string
  color: string
  price: number
  discount: number
  quantity: number
}
export type TCart = {
  _id?: ObjectId
  user_id: ObjectId
  products?: TProductsCart[]
  created_at?: Date
  updated_at?: Date
}
