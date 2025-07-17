import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/models/success/success.response'
import categoryServices from '~/services/category/category.services'
import { TCategoryPayload } from '~/services/category/type'

export const createCategoryController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new CREATED({
    data: await categoryServices.createCategory(req.body.name)
  }).send(res)
}

export const updateCategoryController = async (
  req: Request<ParamsDictionary, any, TCategoryPayload>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await categoryServices.updateCategory({ _id: req.params.id, name: req.body.name })
  }).send(res)
}

export const getCategoryController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await categoryServices.getCategory()
  }).send(res)
}

export const getCategoryDetailController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await categoryServices.getCategoryById(req.params.id)
  }).send(res)
}

export const deleteCategoryController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  await categoryServices.deleteCategory(req.params.id)
  return new SuccessResponse({}).send(res)
}
