import { ParamSchema } from 'express-validator'
import { BRAND_MESSAGES } from '~/constants/message'
import { idObjectInvalid } from '~/utils/checkValidObjectId'

export const brandIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: BRAND_MESSAGES.BRAND_ID_REQUIRED
  },
  trim: true,
  custom: {
    options: async (value) => {
      idObjectInvalid({ id: value, validation: true })
    }
  }
}

export const updateBrandIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: BRAND_MESSAGES.BRAND_ID_REQUIRED
  },
  trim: true,
  custom: {
    options: async (value) => {
      idObjectInvalid({ id: value, validation: true })
    }
  },
  optional: true
}

export const brandNameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: BRAND_MESSAGES.BRAND_NAME_REQUIRED
  },
  isString: {
    errorMessage: BRAND_MESSAGES.BRAND_NAME_STRING
  },
  trim: true
}
