import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { SuccessResponse } from '~/models/success/success.response'
import wishlistServices from '~/services/wishlist/wishlists.services'
export const getWishListController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await wishlistServices.getWishList(req.decoded_token?.user_id!)
  }).send(res)
}

export const updateWishListController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await wishlistServices.updateWishList({
      ...req.body,
      user_id: req.decoded_token?.user_id!
    })
  }).send(res)
}
