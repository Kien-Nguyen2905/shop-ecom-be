import { ObjectId } from 'mongodb'
import { ACTION_WISHLIST } from '~/constants/enum'

export type TUpdateWishListPayload = {
  user_id: string
  product_id: string
  variant_id: string
  action: ACTION_WISHLIST
}
