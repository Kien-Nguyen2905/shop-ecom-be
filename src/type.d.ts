import { Request } from 'express'
import User from '~/models/schemas/users/users.schemas'
import { TDecodeEmailToken, TTokenPayload } from '~/services/user/type'
declare module 'express' {
  interface Request {
    user?: User
    decoded_email_verify_token?: TDecodeEmailToken
    decoded_authorization?: TTokenPayload
    decoded_token?: TTokenPayload
  }
}
