import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/errors/errors'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status!).json(err)
  }
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err)
}
