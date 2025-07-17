import { ObjectId } from 'mongodb'

export type TProductsWishListItem = {
  product_id: ObjectId
  variant_id: ObjectId
}
export type TProductsWishList = TProductsWishListItem[]

export type TWishlist = {
  _id?: ObjectId
  user_id: ObjectId
  products?: TProductsWishList
  created_at?: Date
  updated_at?: Date
}
