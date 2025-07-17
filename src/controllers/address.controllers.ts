import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { SuccessResponse } from '~/models/success/success.response'
import addressServices from '~/services/address/address.services'

export const provinceController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await addressServices.getProvinces()
  }).send(res)
}

export const districtsByProvinceController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await addressServices.getDistrictsByProvince(req.params.province_code)
  }).send(res)
}

export const wardsByDistrictController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await addressServices.getWardsByDistrict(req.params.district_code)
  }).send(res)
}
