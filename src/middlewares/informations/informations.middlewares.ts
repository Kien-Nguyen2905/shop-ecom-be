import { checkSchema } from 'express-validator'
import { categoryIdSchema } from '~/middlewares/categories/param.schema'
import { informationIdSchema } from '~/middlewares/informations/param.schema'
import { attributeSchema } from '~/middlewares/products/param.schema'
import { validate } from '~/utils/validate'

export const createInformationValidator = validate(
  checkSchema(
    {
      category_id: categoryIdSchema,
      attributes: attributeSchema
    },
    ['body']
  )
)

export const informationParamValidator = validate(
  checkSchema(
    {
      category_id: categoryIdSchema
    },
    ['params']
  )
)

export const deleteInformationValidator = validate(
  checkSchema(
    {
      id: informationIdSchema
    },
    ['params']
  )
)

export const updateInformationValidator = validate(
  checkSchema(
    {
      id: informationIdSchema,
      category_id: categoryIdSchema,
      attributes: attributeSchema
    },
    ['params', 'body']
  )
)
