import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/models/success/success.response'
import warehouseServices from '~/services/warehouse/warehouse.services'

export const createWareHouseController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new CREATED({
    data: await warehouseServices.createWarehouse(req.body)
  }).send(res)
}

export const getWareHouseController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await warehouseServices.getWarehouse(req.query.variantId as string)
  }).send(res)
}

export const getWareHouseByIdController = async (
  req: Request<{ id: string }, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await warehouseServices.getWarehouseById(req.params.id)
  }).send(res)
}

export const updateWarehouseController = async (
  req: Request<{ id: string }, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { quantity, product_id, variant_id } = req.body
  return new SuccessResponse({
    data: await warehouseServices.updateWarehouse({ quantity, product_id, variant_id, id: req.params.id })
  }).send(res)
}
