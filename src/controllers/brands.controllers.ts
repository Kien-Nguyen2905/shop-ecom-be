import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/models/success/success.response'
import brandServices from '~/services/brand/brand.services'
import { TCategoryPayload } from '~/services/category/type'

export const createBrandController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new CREATED({
    data: await brandServices.createBrand(req.body.name)
  }).send(res)
}

export const updateBrandController = async (
  req: Request<ParamsDictionary, any, TCategoryPayload>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await brandServices.updateBrand({ _id: req.params.id, name: req.body.name })
  }).send(res)
}

export const getBrandController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await brandServices.getBrands()
  }).send(res)
}

export const getBrandDetailController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await brandServices.getBrandById(req.params.id)
  }).send(res)
}

export const deleteBrandController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  await brandServices.deleteBrand(req.params.id)
  return new SuccessResponse({}).send(res)
}
