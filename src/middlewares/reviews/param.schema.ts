import { ParamSchema } from 'express-validator'
import { REVIEW_MESSAGES } from '~/constants/message'

export const titleSchema: ParamSchema = {
  notEmpty: {
    errorMessage: REVIEW_MESSAGES.TITLE_REQUIRED
  },
  isString: {
    errorMessage: REVIEW_MESSAGES.TITLE_MUST_BE_STRING
  },
  trim: true
}
