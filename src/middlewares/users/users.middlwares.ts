import { checkSchema } from 'express-validator'
import { productIdSchema } from '~/middlewares/products/param.schema'
import {
  accessTokenSchema,
  confirmPasswordSchema,
  emailSchema,
  emailVerifySchema,
  emailTokenSchema,
  fullNameSchema,
  passwordSchema,
  refreshTokenSchema,
  passwordTokenSchema,
  phoneSchema,
  addressSchema,
  fullNameUpdateSchema
} from '~/middlewares/users/param.schema'
import { validate } from '~/utils/validate'

export const verifyEmailValidator = validate(
  checkSchema(
    {
      full_name: fullNameSchema,
      email: emailVerifySchema,
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)
export const reSendVerifyValidator = validate(checkSchema({ email: emailSchema }, ['body']))
export const registerValidator = validate(
  checkSchema(
    {
      email_token: emailTokenSchema
    },
    ['body']
  )
)
export const loginValidator = validate(
  checkSchema(
    {
      email: emailSchema,
      password: passwordSchema
    },
    ['body']
  )
)
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: accessTokenSchema
    },
    ['headers']
  )
)
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: refreshTokenSchema
    },
    ['body']
  )
)
export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: emailSchema
    },
    ['body']
  )
)
export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
      password_token: passwordTokenSchema
    },
    ['body']
  )
)
export const updateProfileValidator = validate(
  checkSchema(
    {
      full_name: fullNameUpdateSchema,
      phone: phoneSchema,
      address: addressSchema
    },
    ['body']
  )
)
