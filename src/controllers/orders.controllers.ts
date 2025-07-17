import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { SuccessResponse } from '~/models/success/success.response'
import orderServices from '~/services/order/orders.services'
import { TTokenPayload } from '~/services/user/type'

export const createOrderController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await orderServices.createOrder({ user_id: req.decoded_token?.user_id as string, ...req.body })
  }).send(res)
}

export const cancelOrderController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  await orderServices.cancelOrder(req.params.id)
  return new SuccessResponse({}).send(res)
}

export const updateOrderController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await orderServices.updateOrder(req.body)
  }).send(res)
}

export const getOrderByUserController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_token as TTokenPayload
  return new SuccessResponse({
    data: await orderServices.getOrderByUser(user_id)
  }).send(res)
}

export const getOrderController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await orderServices.getOrder()
  }).send(res)
}

export const checkStockController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  await orderServices.checkStockAvailability(req.body)
  return new SuccessResponse({}).send(res)
}
