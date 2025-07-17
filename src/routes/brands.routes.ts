import { Router } from 'express'
import {
  createBrandController,
  deleteBrandController,
  getBrandController,
  getBrandDetailController,
  updateBrandController
} from '~/controllers/brands.controllers'

import { adminAccessValidator } from '~/middlewares/admins/admins.middlewares'
import { brandParamValidator, brandValidator, updatebrandlValidator } from '~/middlewares/brands/brands.middlewares'

import { wrapRequestHandler } from '~/utils/handlerError'

const brandRoute = Router()

brandRoute.post('/', brandValidator, adminAccessValidator, wrapRequestHandler(createBrandController))

brandRoute.put('/:id', updatebrandlValidator, adminAccessValidator, wrapRequestHandler(updateBrandController))

brandRoute.get('/', wrapRequestHandler(getBrandController))

brandRoute.get('/:id', brandParamValidator, wrapRequestHandler(getBrandDetailController))

brandRoute.delete('/:id', brandParamValidator, adminAccessValidator, wrapRequestHandler(deleteBrandController))

export default brandRoute
