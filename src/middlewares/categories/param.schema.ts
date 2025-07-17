import { ParamSchema } from 'express-validator'
import { CATEGORY_MESSAGES } from '~/constants/message'
import { idObjectInvalid } from '~/utils/checkValidObjectId'

export const categoryIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: CATEGORY_MESSAGES.CATEGORY_NAME_REQUIRED
  },
  isString: {
    errorMessage: CATEGORY_MESSAGES.CATEGORY_ID_MUST_BE_STRING
  },
  trim: true,
  custom: {
    options: async (value) => {
      idObjectInvalid({ id: value, validation: true })
    }
  }
}

export const updateCategoryIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: CATEGORY_MESSAGES.CATEGORY_NAME_REQUIRED
  },
  isString: {
    errorMessage: CATEGORY_MESSAGES.CATEGORY_ID_MUST_BE_STRING
  },
  trim: true,
  custom: {
    options: async (value) => {
      idObjectInvalid({ id: value, validation: true })
    }
  },
  optional: true
}

export const categoryNameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: CATEGORY_MESSAGES.CATEGORY_NAME_REQUIRED
  },
  isString: {
    errorMessage: CATEGORY_MESSAGES.CATEGORY_NAME_STRING
  },
  trim: true
}
