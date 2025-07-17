import { checkSchema } from 'express-validator'
import { productIdSchema, variantIdSchema } from '~/middlewares/products/param.schema'
import { actionSchema } from '~/middlewares/wishlists/param.schema'
import { validate } from '~/utils/validate'

export const updateWishListValidator = validate(
  checkSchema(
    {
      action: actionSchema,
      product_id: productIdSchema,
      variant_id: variantIdSchema
    },
    ['body']
  )
)
