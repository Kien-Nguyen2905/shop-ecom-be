import { ParamSchema } from 'express-validator'
import { INFORMATION_MESSAGES } from '~/constants/message'
import { idObjectInvalid } from '~/utils/checkValidObjectId'

export const informationIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: INFORMATION_MESSAGES.INFORMATION_ID_REQUIRED
  },
  isString: {
    errorMessage: INFORMATION_MESSAGES.INFORMATION_ID_STRING
  },
  trim: true,
  custom: {
    options: async (value) => {
      idObjectInvalid({ id: value, validation: true })
    }
  }
}
