import { ParamSchema } from 'express-validator'
import { PRODUCT_MESSAGES } from '~/constants/message'
import { idObjectInvalid } from '~/utils/checkValidObjectId'

export const nameProductSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.PRODUCY_NAME_REQUIRED
  },
  isString: {
    errorMessage: PRODUCT_MESSAGES.PRODUCY_NAME_STRING
  },
  trim: true
}

export const productIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.PRODUCT_ID_REQUIRED
  },
  isString: {
    errorMessage: PRODUCT_MESSAGES.PRODUCT_ID_MUST_BE_STRING
  },
  trim: true,
  custom: {
    options: async (value) => {
      idObjectInvalid({ id: value, validation: true })
    }
  }
}

export const variantIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.VARIANT_ID_REQUIRED
  },
  isString: {
    errorMessage: PRODUCT_MESSAGES.VARIANT_ID_MUST_BE_STRING
  },
  trim: true,
  custom: {
    options: async (value) => {
      idObjectInvalid({ id: value, validation: true })
    }
  }
}

export const thumbnailSchema: ParamSchema = {
  isString: {
    errorMessage: PRODUCT_MESSAGES.THUMBNAIL_MUST_BE_STRING
  },
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.THUMBNAIL_NOT_EMPTY
  },
  trim: true
}

export const descriptionSchema: ParamSchema = {
  isString: {
    errorMessage: PRODUCT_MESSAGES.DESCRIPTION_MUST_BE_STRING
  },
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.DESCRIPTION_NOT_EMPTY
  }
}

export const featuredSchema: ParamSchema = {
  isObject: {
    errorMessage: PRODUCT_MESSAGES.FEATURED_MUST_BE_OBJECT
  },
  custom: {
    options: (value) => {
      if (typeof value !== 'object' || value === null) {
        throw new Error(PRODUCT_MESSAGES.FEATURED_MUST_BE_OBJECT)
      }
      // Additional validation for each property
      const { isPopular, onSale, isRated } = value
      if (typeof isPopular !== 'boolean') {
        throw new Error(PRODUCT_MESSAGES.FEATURED_IS_POPULAR_MUST_BE_BOOLEAN)
      }
      if (typeof onSale !== 'boolean') {
        throw new Error(PRODUCT_MESSAGES.FEATURED_ON_SALE_MUST_BE_BOOLEAN)
      }
      if (typeof isRated !== 'boolean') {
        throw new Error(PRODUCT_MESSAGES.FEATURED_IS_RATED_MUST_BE_BOOLEAN)
      }
      return true
    }
  },
  optional: true
}

export const variantsSchema: ParamSchema = {
  isArray: {
    errorMessage: PRODUCT_MESSAGES.VARIANTS_MUST_BE_ARRAY
  },
  custom: {
    options: (value: any[], { req }) => {
      const minimum_stock = req.body.minimum_stock
      value.forEach((variant) => {
        if (typeof variant.color !== 'string' || variant.color === '')
          throw new Error(PRODUCT_MESSAGES.VARIANT_COLOR_MUST_BE_STRING)
        if (typeof variant.price !== 'number' || variant.price <= 0 || isNaN(variant.price))
          throw new Error(PRODUCT_MESSAGES.VARIANT_PRICE_POSITIVE)
        if (!Number.isInteger(variant.stock) || variant.stock <= 0) {
          throw new Error(PRODUCT_MESSAGES.VARIANT_STOCK_POSITIVE_INTEGER)
        }
        if (variant.stock <= minimum_stock) {
          throw new Error(PRODUCT_MESSAGES.VARIANT_STOCK_MINIMUM_STOCK)
        }
        if (
          variant.images.length < 3 ||
          !Array.isArray(variant.images) ||
          !variant.images.every((img: any) => typeof img === 'string' && img.startsWith('http'))
        ) {
          throw new Error(PRODUCT_MESSAGES.VARIANT_IMAGES_INVALID)
        }
        if (typeof variant.discount !== 'number' || variant.discount < 0 || variant.discount > 1) {
          throw new Error(PRODUCT_MESSAGES.VARIANT_DISCOUNT_BETWEEN_0_AND_1)
        }
      })
      return true
    }
  }
}

export const rateSchema: ParamSchema = {
  isInt: {
    options: { min: 0, max: 5 },
    errorMessage: PRODUCT_MESSAGES.RATE_MUST_BE_INTEGER
  }
}

export const miniumStockSchema: ParamSchema = {
  isInt: {
    options: { min: 1 },
    errorMessage: PRODUCT_MESSAGES.MINIMUM_STOCK
  }
}

export const attributeSchema: ParamSchema = {
  isObject: {
    errorMessage: PRODUCT_MESSAGES.ATTRIBUTE_MUST_BE_OBJECT
  }
}

export const updateNameProductSchema: ParamSchema = {
  optional: true,
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.PRODUCY_NAME_REQUIRED
  },
  isString: {
    errorMessage: PRODUCT_MESSAGES.PRODUCY_NAME_STRING
  },
  trim: true
}

export const updateVariantIdSchema: ParamSchema = {
  optional: true,
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.VARIANT_ID_REQUIRED
  },
  isString: {
    errorMessage: PRODUCT_MESSAGES.VARIANT_ID_MUST_BE_STRING
  },
  trim: true,
  custom: {
    options: async (value) => {
      idObjectInvalid({ id: value, validation: true })
    }
  }
}

export const updateThumbnailSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.THUMBNAIL_MUST_BE_STRING
  },
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.THUMBNAIL_NOT_EMPTY
  },

  trim: true
}

export const updateDescriptionSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: PRODUCT_MESSAGES.DESCRIPTION_MUST_BE_STRING
  },
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.DESCRIPTION_NOT_EMPTY
  }
}

export const updateFeaturedSchema: ParamSchema = {
  optional: true,
  isObject: {
    errorMessage: PRODUCT_MESSAGES.FEATURED_MUST_BE_OBJECT
  },
  custom: {
    options: (value) => {
      if (typeof value !== 'object' || value === null) {
        throw new Error(PRODUCT_MESSAGES.FEATURED_MUST_BE_OBJECT)
      }
      const { isPopular, onSale, isRated } = value
      if (typeof isPopular !== 'boolean') {
        throw new Error(PRODUCT_MESSAGES.FEATURED_IS_POPULAR_MUST_BE_BOOLEAN)
      }
      if (typeof onSale !== 'boolean') {
        throw new Error(PRODUCT_MESSAGES.FEATURED_ON_SALE_MUST_BE_BOOLEAN)
      }
      if (typeof isRated !== 'boolean') {
        throw new Error(PRODUCT_MESSAGES.FEATURED_IS_RATED_MUST_BE_BOOLEAN)
      }
      return true
    }
  }
}

export const updateVariantsSchema: ParamSchema = {
  optional: true,
  isArray: {
    errorMessage: PRODUCT_MESSAGES.VARIANTS_MUST_BE_ARRAY
  },
  custom: {
    options: (value: any[]) => {
      value.forEach((variant) => {
        if (typeof variant.color !== 'string' || variant.color === '')
          throw new Error(PRODUCT_MESSAGES.VARIANT_COLOR_MUST_BE_STRING)
        if (typeof variant.price !== 'number' || variant.price <= 0)
          throw new Error(PRODUCT_MESSAGES.VARIANT_PRICE_POSITIVE)
        if (!Number.isInteger(variant.stock) || variant.stock <= 0)
          throw new Error(PRODUCT_MESSAGES.VARIANT_STOCK_POSITIVE_INTEGER)
        if (
          variant.images.length < 3 ||
          !Array.isArray(variant.images) ||
          !variant.images.every((img: any) => typeof img === 'string' && img.startsWith('http'))
        ) {
          throw new Error(PRODUCT_MESSAGES.VARIANT_IMAGES_INVALID)
        }
        if (typeof variant.discount !== 'number' || variant.discount < 0 || variant.discount > 1) {
          throw new Error(PRODUCT_MESSAGES.VARIANT_DISCOUNT_BETWEEN_0_AND_1)
        }
      })
      return true
    }
  }
}

export const updateRateSchema: ParamSchema = {
  optional: true,
  isInt: {
    options: { min: 0, max: 5 },
    errorMessage: PRODUCT_MESSAGES.RATE_MUST_BE_INTEGER
  }
}

export const updateMiniumStockSchema: ParamSchema = {
  optional: true,
  isInt: {
    options: { min: 1 },
    errorMessage: PRODUCT_MESSAGES.MINIMUM_STOCK
  }
}

export const updateAttributeSchema: ParamSchema = {
  optional: true,
  isObject: {
    errorMessage: PRODUCT_MESSAGES.ATTRIBUTE_MUST_BE_OBJECT
  }
}
