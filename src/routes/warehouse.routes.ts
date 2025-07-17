import { Router } from 'express'
import {
  createWareHouseController,
  getWareHouseByIdController,
  getWareHouseController,
  updateWarehouseController
} from '~/controllers/warehouse.controller'
import { adminAccessValidator } from '~/middlewares/admins/admins.middlewares'
import { createWrehouseValidator, warehouseUpdateValidator } from '~/middlewares/warehouse/warehouse.middlewares'

import { wrapRequestHandler } from '~/utils/handlerError'

const warehouseRoute = Router()
warehouseRoute.post('/', createWrehouseValidator, adminAccessValidator, wrapRequestHandler(createWareHouseController))

warehouseRoute.get('/', wrapRequestHandler(getWareHouseController))

warehouseRoute.get('/:id', wrapRequestHandler(getWareHouseByIdController))

warehouseRoute.put(
  '/:id',
  warehouseUpdateValidator,
  adminAccessValidator,
  wrapRequestHandler(updateWarehouseController)
)

export default warehouseRoute
