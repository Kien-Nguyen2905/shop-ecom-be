import { HTTP_STATUS } from '~/constants/httpStatus'
import { POPULAR_MESSAGES } from '~/constants/message'
import { TSuccessResponseProps } from '~/models/success/type'

export class SuccessResponse {
  message: string
  status: number
  data: Record<string, any>

  constructor({ message, status = HTTP_STATUS.OK, data = {} }: TSuccessResponseProps) {
    this.message = message || POPULAR_MESSAGES.SUCCESS_MESSAGES
    this.status = status
    this.data = data
  }

  send(respon: any) {
    return respon.status(this.status).json(this)
  }
}

export class CREATED extends SuccessResponse {
  constructor({
    message = POPULAR_MESSAGES.SUCCESS_MESSAGES,
    status = HTTP_STATUS.CREATED,
    data
  }: TSuccessResponseProps) {
    super({
      message,
      status,
      data
    })
  }
}
