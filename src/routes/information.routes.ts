import { Router } from 'express'
import {
  createInformationController,
  deleteInformationByIdController,
  getInformationByCategoryController,
  updateInformationController
} from '~/controllers/information.controller'
import { adminAccessValidator } from '~/middlewares/admins/admins.middlewares'
import {
  createInformationValidator,
  deleteInformationValidator,
  informationParamValidator,
  updateInformationValidator
} from '~/middlewares/informations/informations.middlewares'
import { wrapRequestHandler } from '~/utils/handlerError'

const informationRoute = Router()

informationRoute.post(
  '/',
  createInformationValidator,
  adminAccessValidator,
  wrapRequestHandler(createInformationController)
)

informationRoute.get('/:category_id', informationParamValidator, wrapRequestHandler(getInformationByCategoryController))

informationRoute.put('/:id', updateInformationValidator, wrapRequestHandler(updateInformationController))

informationRoute.delete('/:id', deleteInformationValidator, wrapRequestHandler(deleteInformationByIdController))

export default informationRoute
