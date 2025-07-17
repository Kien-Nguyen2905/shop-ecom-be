import { Router } from 'express'
import { getWishListController, updateWishListController } from '~/controllers/wishlists.controllers'
import { accessTokenValidator } from '~/middlewares/users/users.middlwares'
import { updateWishListValidator } from '~/middlewares/wishlists/wishlist.middlewares'
import { wrapRequestHandler } from '~/utils/handlerError'

const wishlistRoute = Router()

wishlistRoute.get('/', accessTokenValidator, wrapRequestHandler(getWishListController))

wishlistRoute.put('/', updateWishListValidator, accessTokenValidator, wrapRequestHandler(updateWishListController))

export default wishlistRoute
