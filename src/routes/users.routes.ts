import { Router } from 'express'
import {
  loginController,
  logoutController,
  registerController,
  verifyEmailController,
  reSendVerifyController,
  reSendForgotController,
  forgotPasswordController,
  resetPasswordController,
  getProfileController,
  refreshTokenController,
  updateProfileController,
  getAllUserController,
  oauthController,
  getUserByIdController
} from '~/controllers/users.controllers'
import { adminAccessValidator } from '~/middlewares/admins/admins.middlewares'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailValidator,
  reSendVerifyValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator
} from '~/middlewares/users/users.middlwares'
import { wrapRequestHandler } from '~/utils/handlerError'

const userRoute = Router()

userRoute.post('/verify-email', verifyEmailValidator, wrapRequestHandler(verifyEmailController))

userRoute.post('/resend-verify', reSendVerifyValidator, wrapRequestHandler(reSendVerifyController))

userRoute.post('/register', registerValidator, wrapRequestHandler(registerController))

userRoute.post('/login', loginValidator, wrapRequestHandler(loginController))

userRoute.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

userRoute.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

userRoute.post('/resend-forgot', forgotPasswordValidator, wrapRequestHandler(reSendForgotController))

userRoute.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

userRoute.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

userRoute.get('/profile', accessTokenValidator, wrapRequestHandler(getProfileController))

userRoute.put('/profile', accessTokenValidator, updateProfileValidator, wrapRequestHandler(updateProfileController))

userRoute.get('/all', adminAccessValidator, updateProfileValidator, wrapRequestHandler(getAllUserController))

userRoute.get('/wishlist', adminAccessValidator, updateProfileValidator, wrapRequestHandler(getAllUserController))

userRoute.get('/oauth/google', wrapRequestHandler(oauthController))

userRoute.get('/:id', adminAccessValidator, wrapRequestHandler(getUserByIdController))

export default userRoute
