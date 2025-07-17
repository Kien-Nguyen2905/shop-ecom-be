import { ObjectId } from 'mongodb'
import { ACTION_WISHLIST } from '~/constants/enum'
import { InternalServerError } from '~/models/errors/errors'
import { TWishlist } from '~/models/schemas/wishlists/type'
import databaseService from '~/services/database/database.services'
import productServices from '~/services/product/product.services'
import { TUpdateWishListPayload } from '~/services/wishlist/type'

class WishlistService {
  async getWishList(user_id: string) {
    return (await databaseService.wishlist.findOne({ user_id: new ObjectId(user_id) })) as TWishlist
  }

  async updateWishList({ user_id, product_id, action, variant_id }: TUpdateWishListPayload) {
    // Check product exists
    await productServices.getProductById(product_id)

    const payloadItem = {
      variant_id: new ObjectId(variant_id),
      product_id: new ObjectId(product_id)
    }

    const wishList = await this.getWishList(user_id)

    const query: Record<string, any> = {}

    const itemExists = wishList.products?.some(
      (item) => item.product_id.toString() === product_id && item.variant_id.toString() === variant_id
    )

    if (action === ACTION_WISHLIST.ADD && !itemExists) {
      query.$push = { products: payloadItem }
    }

    if (action === ACTION_WISHLIST.REMOVE && itemExists) {
      query.$pull = { products: payloadItem }
    }

    const result = await databaseService.wishlist.updateOne({ user_id: new ObjectId(user_id) }, query)

    if (!result.modifiedCount || !result.acknowledged) {
      throw new InternalServerError()
    }

    return await this.getWishList(user_id)
  }
}
const wishlistServices = new WishlistService()
export default wishlistServices
