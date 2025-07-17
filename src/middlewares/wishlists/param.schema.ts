import { ParamSchema } from 'express-validator'
import { WISHLIST_MESSAGES } from '~/constants/message'

export const actionSchema: ParamSchema = {
  isInt: {
    options: { min: 0, max: 1 },
    errorMessage: WISHLIST_MESSAGES.ACTION_IS_INVALID
  },
  notEmpty: {
    errorMessage: WISHLIST_MESSAGES.ACTION_IS_REQUIRED
  }
}
