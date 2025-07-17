import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/models/success/success.response'
import reviewServices from '~/services/review/review.services'
import { TTokenPayload } from '~/services/user/type'

export const createReviewController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_token as TTokenPayload
  return new CREATED({ data: await reviewServices.createReview({ user_id, ...req.body }) }).send(res)
}

export const getReviewController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({ data: await reviewServices.getReview(req.query.search as string) }).send(res)
}

export const getReviewByProductIdController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({ data: await reviewServices.getReviewByProductId(req.params.id as string) }).send(res)
}
