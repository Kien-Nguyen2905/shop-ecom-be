import { ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { env } from '~/constants/config'
import { ROLE } from '~/constants/enum'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus, UnauthorizedError } from '~/models/errors/errors'
import { TTokenPayload } from '~/services/user/type'
import { verifyToken } from '~/utils/jwt'

export const adminAccessSchema: ParamSchema = {
  custom: {
    options: async (value: string) => {
      const access_token = (value || '').split(' ')[1]
      try {
        const docode_token = await verifyToken<TTokenPayload>({
          token: access_token,
          secretOrPublicKey: env.JWT_SECRET_ACCESS_TOKEN as string
        })
        if (docode_token.role !== ROLE.ADMIN) {
          throw new UnauthorizedError()
        }
      } catch (error) {
        throw new ErrorWithStatus({
          message: (error as JsonWebTokenError).message,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      return true
    }
  }
}
