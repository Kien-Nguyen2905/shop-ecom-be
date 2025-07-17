import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'
import { REASON_PHRASES } from '~/constants/reasonPhrases'
import { TErrorProps, TErrorsEntityProps } from '~/models/errors/type'

export class ErrorWithStatus extends Error {
  message: string
  status?: number
  constructor({ message, status }: { message: string; status?: number }) {
    super()
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: TErrorsEntityProps
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: TErrorsEntityProps }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
export class InternalServerError extends ErrorWithStatus {
  constructor({
    message = REASON_PHRASES.INTERNAL_SERVER_ERROR,
    status = HTTP_STATUS.INTERNAL_SERVER_ERROR
  }: TErrorProps = {}) {
    super({ message, status })
  }
}

export class ConflictRequestError extends ErrorWithStatus {
  constructor({ message = REASON_PHRASES.CONFLICT, status = HTTP_STATUS.CONFLICT }: TErrorProps = {}) {
    super({ message, status })
  }
}

export class BadRequestError extends ErrorWithStatus {
  constructor({ message = REASON_PHRASES.BAD_REQUEST, status = HTTP_STATUS.BAD_REQUEST }: TErrorProps = {}) {
    super({ message, status })
  }
}

export class UnauthorizedError extends ErrorWithStatus {
  constructor({ message = REASON_PHRASES.UNAUTHORIZED, status = HTTP_STATUS.UNAUTHORIZED }: TErrorProps = {}) {
    super({ message, status })
  }
}

export class NotFoundError extends ErrorWithStatus {
  constructor({ message = REASON_PHRASES.NOT_FOUND, status = HTTP_STATUS.NOT_FOUND }: TErrorProps = {}) {
    super({ message, status })
  }
}

export class ForbiddenError extends ErrorWithStatus {
  constructor({ message = REASON_PHRASES.FORBIDDEN, status = HTTP_STATUS.FORBIDDEN }: TErrorProps = {}) {
    super({ message, status })
  }
}

export class NocontentError extends ErrorWithStatus {
  constructor({ message = REASON_PHRASES.NO_CONTENT, status = HTTP_STATUS.NO_CONTENT }: TErrorProps = {}) {
    super({ message, status })
  }
}
