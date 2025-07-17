import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { SuccessResponse } from '~/models/success/success.response'
import cartServices from '~/services/cart/cart.services'
import { TTokenPayload } from '~/services/user/type'
export const getCartController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await cartServices.getCart((req.decoded_token as TTokenPayload).user_id)
  }).send(res)
}

export const updateCartdController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_token as TTokenPayload
  return new SuccessResponse({
    data: await cartServices.updateCart({ ...req.body, user_id })
  }).send(res)
}

export const removeCartdController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_token as TTokenPayload
  return new SuccessResponse({
    data: await cartServices.removeCart({ item_id: req.body.item_id, user_id })
  }).send(res)
}
