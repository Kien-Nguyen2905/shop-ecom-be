import { Router } from 'express'
import {
  districtsByProvinceController,
  provinceController,
  wardsByDistrictController
} from '~/controllers/address.controllers'
import { wrapRequestHandler } from '~/utils/handlerError'

const addressRoute = Router()

addressRoute.get('/provinces', wrapRequestHandler(provinceController))

addressRoute.get('/districts', wrapRequestHandler(districtsByProvinceController))

addressRoute.get('/districts/:province_code', wrapRequestHandler(districtsByProvinceController))

addressRoute.get('/wards', wrapRequestHandler(wardsByDistrictController))

addressRoute.get('/wards/:district_code', wrapRequestHandler(wardsByDistrictController))

export default addressRoute
