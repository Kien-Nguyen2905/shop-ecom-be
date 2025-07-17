import { ObjectId } from 'mongodb'
import { TCart, TProductsCart } from '~/models/schemas/carts/type'

export default class Cart {
  _id?: ObjectId
  user_id: ObjectId
  products?: TProductsCart[]
  created_at?: Date
  updated_at?: Date
  constructor(cart: TCart) {
    const date = new Date()
    this._id = cart._id
    this.user_id = cart.user_id
    this.products = cart.products || []
    this.created_at = cart.created_at || date
    this.updated_at = cart.updated_at || date
  }
}
