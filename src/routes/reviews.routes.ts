import { Router } from 'express'
import {
  createReviewController,
  getReviewByProductIdController,
  getReviewController
} from '~/controllers/reviews.controllers'
import { createReviewValidator } from '~/middlewares/reviews/reviews.middlewares'
import { accessTokenValidator } from '~/middlewares/users/users.middlwares'

import { wrapRequestHandler } from '~/utils/handlerError'

const reviewRoute = Router()

reviewRoute.post('/', createReviewValidator, accessTokenValidator, wrapRequestHandler(createReviewController))

reviewRoute.get('/', wrapRequestHandler(getReviewController))

reviewRoute.get('/:id', wrapRequestHandler(getReviewByProductIdController))

export default reviewRoute
