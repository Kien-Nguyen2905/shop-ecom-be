import { checkSchema } from 'express-validator'
import { brandIdSchema } from '~/middlewares/brands/param.schema'
import { updateCategoryIdSchema } from '~/middlewares/categories/param.schema'
import {
  attributeSchema,
  descriptionSchema,
  featuredSchema,
  miniumStockSchema,
  nameProductSchema,
  productIdSchema,
  thumbnailSchema,
  updateAttributeSchema,
  updateDescriptionSchema,
  updateFeaturedSchema,
  updateMiniumStockSchema,
  updateNameProductSchema,
  updateThumbnailSchema,
  updateVariantsSchema,
  variantsSchema
} from '~/middlewares/products/param.schema'
import { validate } from '~/utils/validate'

export const productValidator = validate(
  checkSchema(
    {
      name: nameProductSchema,
      category_id: updateCategoryIdSchema,
      brand_id: brandIdSchema,
      thumbnail: thumbnailSchema,
      description: descriptionSchema,
      featured: featuredSchema,
      variants: variantsSchema,
      minimum_stock: miniumStockSchema,
      attributes: attributeSchema
    },
    ['body']
  )
)
export const updateProductValidator = validate(
  checkSchema(
    {
      name: updateNameProductSchema,
      category_id: updateCategoryIdSchema,
      brand_id: brandIdSchema,
      thumbnail: updateThumbnailSchema,
      description: updateDescriptionSchema,
      featured: updateFeaturedSchema,
      variants: updateVariantsSchema,
      minimum_stock: updateMiniumStockSchema,
      attributes: updateAttributeSchema
    },
    ['body']
  )
)
export const productParmaValidator = validate(
  checkSchema(
    {
      id: productIdSchema
    },
    ['params']
  )
)
