import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import path from 'path'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { SuccessResponse } from '~/models/success/success.response'
import imagesService from '~/services/images/images.services'
export const uploadImageController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  return new SuccessResponse({
    data: await imagesService.uploadImage(req)
  }).send(res)
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params

  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}
