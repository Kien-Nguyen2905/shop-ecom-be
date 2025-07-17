import { Router } from 'express'
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryController,
  getCategoryDetailController,
  updateCategoryController
} from '~/controllers/categories.controller'
import { adminAccessValidator } from '~/middlewares/admins/admins.middlewares'
import {
  categoryParamValidator,
  categoryValidator,
  updatecategorylValidator
} from '~/middlewares/categories/categories.middlewares'

import { wrapRequestHandler } from '~/utils/handlerError'

const categoryRoute = Router()

categoryRoute.post('/', categoryValidator, adminAccessValidator, wrapRequestHandler(createCategoryController))

categoryRoute.put('/:id', updatecategorylValidator, adminAccessValidator, wrapRequestHandler(updateCategoryController))

categoryRoute.get('/', wrapRequestHandler(getCategoryController))

categoryRoute.get('/:id', categoryParamValidator, wrapRequestHandler(getCategoryDetailController))

categoryRoute.delete('/:id', categoryParamValidator, wrapRequestHandler(deleteCategoryController))

export default categoryRoute
