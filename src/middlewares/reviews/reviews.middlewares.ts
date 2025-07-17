import { checkSchema } from 'express-validator'
import { orderIdSchema } from '~/middlewares/orders/param.schema'
import { descriptionSchema, productIdSchema, rateSchema, variantIdSchema } from '~/middlewares/products/param.schema'
import { titleSchema } from '~/middlewares/reviews/param.schema'
import { validate } from '~/utils/validate'

export const createReviewValidator = validate(
  checkSchema(
    {
      order_id: orderIdSchema,
      product_id: productIdSchema,
      variant_id: variantIdSchema,
      title: titleSchema,
      description: descriptionSchema,
      rate: rateSchema
    },
    ['body']
  )
)
