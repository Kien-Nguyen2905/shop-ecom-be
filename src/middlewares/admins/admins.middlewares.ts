import { checkSchema } from 'express-validator'
import { adminAccessSchema } from '~/middlewares/admins/param.schema'
import { validate } from '~/utils/validate'

export const adminAccessValidator = validate(
  checkSchema(
    {
      Authorization: adminAccessSchema
    },
    ['headers']
  )
)
