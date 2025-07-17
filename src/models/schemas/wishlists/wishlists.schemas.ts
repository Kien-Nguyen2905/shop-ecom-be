import { ObjectId } from 'mongodb'
import { TProductsWishList, TWishlist } from '~/models/schemas/wishlists/type'

export default class Wishlist {
  _id?: ObjectId
  user_id: ObjectId
  products?: TProductsWishList
  created_at?: Date
  updated_at?: Date
  constructor(wishlist: TWishlist) {
    const date = new Date()
    this._id = wishlist._id
    this.user_id = wishlist.user_id
    this.products = wishlist.products || []
    this.created_at = wishlist.created_at || date
    this.updated_at = wishlist.updated_at || date
  }
}
