import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/models/success/success.response'
import transactionServices from '~/services/transaction/transactions.services'

export const getTransactionSePayController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { content, value } = req.query
  return new SuccessResponse({
    data: await transactionServices.getTransactionSePay({
      content: content as string,
      value: value as string,
      user_id: req.decoded_token?.user_id!
    })
  }).send(res)
}

export const getTransactionByOrderController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await transactionServices.getTransactionByOrder(req.params.id as string)
  }).send(res)
}

export const handleSePayWebhookController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  await transactionServices.validateSePayWebhook(req.body)
  return new SuccessResponse({}).send(res)
}

export const createTransactionController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new CREATED({
    data: await transactionServices.createTransaction({
      ...req.body,
      user_id: req.decoded_token?.user_id!
    })
  }).send(res)
}

export const getTransactionController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new CREATED({
    data: await transactionServices.getTransaction()
  }).send(res)
}

export const getRevenueController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await transactionServices.getRevenue(req.query.year as string)
  }).send(res)
}
