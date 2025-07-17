import { ParamSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { ORDER_MESSAGES, PRODUCT_MESSAGES } from '~/constants/message'
import { TProductOrder } from '~/services/order/type'
import { idObjectInvalid } from '~/utils/checkValidObjectId'

export const productsSchema: ParamSchema = {
  isArray: {
    errorMessage: ORDER_MESSAGES.PRODUCTS_ARRAY
  },
  custom: {
    options: (value: TProductOrder[]) => {
      value.forEach((product) => {
        if (typeof product.product_id !== 'string') throw new Error(PRODUCT_MESSAGES.PRODUCT_ID_MUST_BE_STRING)
        if (!ObjectId.isValid(product.product_id)) throw new Error(PRODUCT_MESSAGES.PRODUCT_ID_INVALID)

        if (typeof product.variant_id !== 'string') throw new Error(PRODUCT_MESSAGES.VARIANT_ID_MUST_BE_STRING)
        if (!ObjectId.isValid(product.variant_id)) throw new Error(PRODUCT_MESSAGES.VARIANT_ID_INVALID)

        if (!Number.isInteger(product.quantity) || product.quantity < 0)
          throw new Error(PRODUCT_MESSAGES.VARIANT_STOCK_POSITIVE_INTEGER)

        if (typeof product.image !== 'string') throw new Error(PRODUCT_MESSAGES.THUMBNAIL_MUST_BE_STRING)

        if (typeof product.color !== 'string') throw new Error(PRODUCT_MESSAGES.VARIANT_COLOR_MUST_BE_STRING)

        if (typeof product.discount !== 'number' || product.discount < 0 || product.discount > 1)
          throw new Error(PRODUCT_MESSAGES.VARIANT_DISCOUNT_BETWEEN_0_AND_1)

        if (typeof product.price !== 'number' || product.price < 0)
          throw new Error(PRODUCT_MESSAGES.VARIANT_PRICE_POSITIVE)

        if (typeof product.name !== 'string') throw new Error(PRODUCT_MESSAGES.PRODUCY_NAME_STRING)
      })
      return true
    }
  }
}
export const noteSchema: ParamSchema = {
  isString: {
    errorMessage: ORDER_MESSAGES.ORDER_NOTE_MUST_BE_STRING
  },
  trim: true,
  optional: true
}

export const typePaymentSchema: ParamSchema = {
  isInt: {
    options: { min: 0, max: 1 },
    errorMessage: ORDER_MESSAGES.TYPE_PAYMENT_MUST_BE_INTEGER
  },
  toInt: true
}

export const earnPointSchema: ParamSchema = {
  isNumeric: {
    errorMessage: ORDER_MESSAGES.EARN_POINT_MUST_BE_NUMBER
  },
  optional: true
}

export const transactionIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ORDER_MESSAGES.TRANSACTION_ID_MUST_BE_STRING
  },
  isString: {
    errorMessage: ORDER_MESSAGES.TRANSACTION_ID_REQUIRED
  },
  trim: true,
  custom: {
    options: async (value) => {
      idObjectInvalid({ id: value, validation: true })
    }
  }
}

export const orderIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: ORDER_MESSAGES.ORDER_ID_REQUIRED
  },
  isString: {
    errorMessage: ORDER_MESSAGES.ODER_ID_MUST_BE_STRING
  },
  trim: true,
  custom: {
    options: async (value) => {
      idObjectInvalid({ id: value, validation: true })
    }
  }
}

export const statusSchema: ParamSchema = {
  isInt: {
    options: {
      min: 0,
      max: 3
    },
    errorMessage: ORDER_MESSAGES.STATUS_MUST_BE_INTEGER
  },
  toInt: true
}
