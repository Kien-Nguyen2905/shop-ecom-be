import { checkSchema } from 'express-validator'
import { categoryIdSchema, categoryNameSchema } from '~/middlewares/categories/param.schema'
import { validate } from '~/utils/validate'

export const categoryValidator = validate(
  checkSchema(
    {
      name: categoryNameSchema
    },
    ['body']
  )
)
export const updatecategorylValidator = validate(
  checkSchema(
    {
      name: categoryNameSchema,
      id: categoryIdSchema
    },
    ['body', 'params']
  )
)
export const categoryParamValidator = validate(
  checkSchema(
    {
      id: categoryIdSchema
    },
    ['params']
  )
)
