import { ParamSchema } from 'express-validator'
import { WAREHOUSE_MESSAGES } from '~/constants/message'

export const importQuantitySchema: ParamSchema = {
  isInt: {
    options: { min: 0 },
    errorMessage: WAREHOUSE_MESSAGES.INVALID_IMPORT_QUANTITY
  },
  toInt: true,
  optional: true
}

export const stockSchema: ParamSchema = {
  isInt: {
    options: { min: 0 },
    errorMessage: WAREHOUSE_MESSAGES.INVALID_STOCK_VALUE
  },
  toInt: true,
  notEmpty: {
    errorMessage: WAREHOUSE_MESSAGES.STOCK_REQUIRED
  }
}

export const miniumStockSchema: ParamSchema = {
  isInt: {
    options: { min: 1 },
    errorMessage: WAREHOUSE_MESSAGES.INVALID_MINIMUM_STOCK_VALUE
  },
  toInt: true
}

export const shipmentSchema: ParamSchema = {
  isArray: {
    errorMessage: WAREHOUSE_MESSAGES.SHIPMENTS_MUST_BE_ARRAY
  },
  custom: {
    options: (value: any[]) => {
      value.forEach((shipment) => {
        if (typeof shipment !== 'object' || shipment === null) {
          throw new Error(WAREHOUSE_MESSAGES.INVALID_SHIPMENT_ITEM)
        }
        if (typeof shipment.quantity !== 'number' || shipment.quantity < 0) {
          throw new Error(WAREHOUSE_MESSAGES.INVALID_SHIPMENT_QUANTITY)
        }
        if (typeof shipment.date !== 'string' || isNaN(Date.parse(shipment.date))) {
          throw new Error(WAREHOUSE_MESSAGES.INVALID_SHIPMENT_DATE)
        }
      })
      return true
    }
  },
  optional: true
}
export const quantitySchema: ParamSchema = {
  isInt: {
    options: { min: 1 },
    errorMessage: WAREHOUSE_MESSAGES.QUANTITY_MIN
  },
  toInt: true
}
