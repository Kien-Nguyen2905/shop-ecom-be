import { Router } from 'express'
import {
  createTransactionController,
  getRevenueController,
  getTransactionByOrderController,
  getTransactionController,
  handleSePayWebhookController
} from '~/controllers/transactions.controllers'
import { adminAccessValidator } from '~/middlewares/admins/admins.middlewares'
import { accessTokenValidator } from '~/middlewares/users/users.middlwares'
import { wrapRequestHandler } from '~/utils/handlerError'
const transactionRoute = Router()

transactionRoute.post('/webhook/seepay', wrapRequestHandler(handleSePayWebhookController))

transactionRoute.get('/', adminAccessValidator, wrapRequestHandler(getTransactionController))

transactionRoute.get('/order/:id', accessTokenValidator, wrapRequestHandler(getTransactionByOrderController))

transactionRoute.post('/', accessTokenValidator, wrapRequestHandler(createTransactionController))

transactionRoute.get('/revenue', adminAccessValidator, wrapRequestHandler(getRevenueController))

export default transactionRoute
