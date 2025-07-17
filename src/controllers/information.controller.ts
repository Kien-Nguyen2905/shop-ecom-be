import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/models/success/success.response'
import informationServices from '~/services/infomation/information.services'

export const createInformationController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new CREATED({
    data: await informationServices.createInformation(req.body)
  }).send(res)
}

export const getInformationByCategoryController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await informationServices.getInformationByCategory(req.params.category_id)
  }).send(res)
}

export const updateInformationController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await informationServices.updateInformation({ ...req.body, _id: req.params.id })
  }).send(res)
}

export const deleteInformationByIdController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  await informationServices.deleteInformation(req.params.id)
  return new SuccessResponse({}).send(res)
}
