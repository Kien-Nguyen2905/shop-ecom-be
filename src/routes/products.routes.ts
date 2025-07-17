import { Router } from 'express'
import {
  createProductController,
  getProductController,
  updateProductController,
  deleteProductController,
  getProductByIdController
} from '~/controllers/products.controllers'

import { adminAccessValidator } from '~/middlewares/admins/admins.middlewares'
import {
  productParmaValidator,
  updateProductValidator,
  productValidator
} from '~/middlewares/products/products.middlewares'
import { wrapRequestHandler } from '~/utils/handlerError'

const productRoute = Router()

productRoute.post('/', productValidator, adminAccessValidator, wrapRequestHandler(createProductController))

productRoute.get('/', wrapRequestHandler(getProductController))

productRoute.get('/:id', productParmaValidator, wrapRequestHandler(getProductByIdController))

productRoute.put(
  '/:id',
  productParmaValidator,
  updateProductValidator,
  adminAccessValidator,
  wrapRequestHandler(updateProductController)
)

productRoute.delete('/:id', productParmaValidator, adminAccessValidator, wrapRequestHandler(deleteProductController))

export default productRoute
