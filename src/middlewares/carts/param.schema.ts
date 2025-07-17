import { ParamSchema } from 'express-validator'
import { CART_MESSAGES, POPULAR_MESSAGES } from '~/constants/message'
import { idObjectInvalid } from '~/utils/checkValidObjectId'

export const quantityCartSchema: ParamSchema = {
  isInt: {
    errorMessage: POPULAR_MESSAGES.QUANTITY_MIN
  },
  toInt: true
}

export const itemIdCartSchema: ParamSchema = {
  notEmpty: {
    errorMessage: CART_MESSAGES.ITEM_ID_REQUIRED
  },
  isString: {
    errorMessage: CART_MESSAGES.ITEM_ID_MUST_BE_STRING
  },
  trim: true,
  custom: {
    options: async (value) => {
      idObjectInvalid({ id: value, validation: true })
    }
  }
}
