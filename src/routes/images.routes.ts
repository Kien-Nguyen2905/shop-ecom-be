import { Router } from 'express'
import { uploadImageController } from '~/controllers/images.controllers'
import { wrapRequestHandler } from '~/utils/handlerError'
const imagesRoute = Router()

imagesRoute.post('/', wrapRequestHandler(uploadImageController))

export default imagesRoute
