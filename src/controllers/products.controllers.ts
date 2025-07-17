import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { POPULAR_MESSAGES } from '~/constants/message'
import { CREATED, SuccessResponse } from '~/models/success/success.response'
import productServices from '~/services/product/product.services'
import { TProductQuery } from '~/services/product/type'

export const createProductController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new CREATED({ data: await productServices.createProduct(req.body) }).send(res)
}

export const getProductController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({ data: await productServices.getProduct(req.query as TProductQuery) }).send(res)
}

export const getProductByIdController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  return new SuccessResponse({ data: await productServices.getProductById(req.params.id) }).send(res)
}

export const updateProductController = async (
  req: Request<{ id: string }, any, any>,
  res: Response,
  next: NextFunction
) => {
  const productId = req.params.id

  return new SuccessResponse({ data: await productServices.updateProduct(productId, req.body) }).send(res)
}

export const deleteProductController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  await productServices.deleteProduct(req.params.id)
  return new SuccessResponse({ message: POPULAR_MESSAGES.SUCCESS_MESSAGES }).send(res)
}
