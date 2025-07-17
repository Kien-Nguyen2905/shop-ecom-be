import { checkSchema } from 'express-validator'
import { miniumStockSchema, productIdSchema, variantIdSchema } from '~/middlewares/products/param.schema'
import { importQuantitySchema, quantitySchema, shipmentSchema, stockSchema } from '~/middlewares/warehouse/param.schema'
import { validate } from '~/utils/validate'

export const createWrehouseValidator = validate(
  checkSchema(
    {
      product_id: productIdSchema,
      variant_id: variantIdSchema,
      import_quantity: importQuantitySchema,
      minimum_stock: miniumStockSchema,
      shipments: shipmentSchema
    },
    ['body']
  )
)

export const warehouseUpdateValidator = validate(
  checkSchema(
    {
      quantity: quantitySchema,
      product_id: productIdSchema,
      variant_id: variantIdSchema
    },
    ['body']
  )
)
