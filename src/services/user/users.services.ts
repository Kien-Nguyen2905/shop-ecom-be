import { ObjectId } from 'mongodb'
import { EVerification, ROLE } from '~/constants/enum'
import Token from '~/models/schemas/tokens/tokens.schemas'
import User from '~/models/schemas/users/users.schemas'
import databaseService from '~/services/database/database.services'
import {
  IAccessToken,
  IRefreshToken,
  TAddress,
  TDecodeEmailToken,
  TLoginReqBody,
  TRefreshTokenPayload,
  TRegisterReqBody,
  TResetPasswordReqBody,
  TUpdateProfilePayload,
  TVerificationEmail,
  TVerifyForgotReqBody,
  TVerifyReqBody
} from '~/services/user/type'
import { hashPassword } from '~/utils/crypto'
import { decodeToken, signToken, verifyToken } from '~/utils/jwt'
import Verification from '~/models/schemas/verifications/verifications.schemas'
import PasswordReset from '~/models/schemas/password-resets/password-resets.schemas'
import { InternalServerError, NotFoundError, UnauthorizedError } from '~/models/errors/errors'
import Cart from '~/models/schemas/carts/carts.schemas'
import Wishlist from '~/models/schemas/wishlists/wishlists.schemas'
import { USERS_MESSAGES } from '~/constants/message'
import axios from 'axios'
import { sendVerification } from '~/utils/sendmail'
import { env } from '~/constants/config'

class UserServices {
  async signAccessToken({ user_id, role }: IAccessToken) {
    return await signToken({
      payload: { user_id, role },
      privateKey: env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as string
      }
    })
  }

  async signRefreshToken({ user_id, role, exp }: IRefreshToken) {
    if (exp) {
      return await signToken({
        payload: { user_id, role, exp },
        privateKey: env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
    return await signToken({
      payload: { user_id, role },
      privateKey: env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as string
      }
    })
  }

  async signAPairToken({ user_id, role, exp }: IRefreshToken) {
    return Promise.all([this.signAccessToken({ user_id, role }), this.signRefreshToken({ user_id, role, exp })])
  }

  async signForgotPassword(email: string) {
    return await signToken({
      payload: { email },
      privateKey: env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string
      }
    })
  }

  private signEmailVerify({ full_name, email, password }: TRegisterReqBody) {
    return signToken({
      payload: {
        full_name,
        email,
        password
      },
      privateKey: env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private async sendVerificationEmail({ email, token, type }: TVerificationEmail) {
    return sendVerification({ email, token, type })
  }

  private async sendVerificationForgotPassword({ email, token, type }: TVerificationEmail) {
    return sendVerification({ email, token, type })
  }

  async verifyEmail({ email, password, full_name }: TVerifyReqBody) {
    const email_token = await this.signEmailVerify({
      full_name: full_name,
      email: email,
      password: hashPassword(password)
    } as TVerifyReqBody)
    const verificationExist = await databaseService.verifications.findOne({ email })
    if (verificationExist) {
      const result = await databaseService.verifications.updateOne(
        { email },
        {
          $set: {
            email_token,
            updated_at: new Date()
          }
        }
      )
      if (!result.modifiedCount) {
        throw new InternalServerError()
      }
    } else {
      const verification = new Verification({
        email: email,
        email_token
      })
      const result = await databaseService.verifications.insertOne(verification)
      if (!result.insertedId) {
        throw new InternalServerError()
      }
    }
    await this.sendVerificationEmail({
      email: email,
      token: email_token,
      type: EVerification.Email
    })
    return { email_token }
  }

  async reSendVerifyEmail(email: string) {
    const verificationRecord = await databaseService.verifications.findOne({ email })

    if (!verificationRecord) {
      throw new NotFoundError()
    }

    const decodedToken = await decodeToken<TVerifyReqBody>({ token: verificationRecord.email_token })

    const newEmailToken = await this.signEmailVerify(decodedToken!)

    const updateResult = await databaseService.verifications.updateOne(
      { email },
      { $set: { email_token: newEmailToken, created_at: new Date() } }
    )

    if (!updateResult.modifiedCount) {
      throw new InternalServerError()
    }
    await this.sendVerificationEmail({
      email,
      token: newEmailToken,
      type: EVerification.Email
    })

    return { email_token: newEmailToken }
  }

  async register(email_token: string) {
    const user_id = new ObjectId()
    const emailTokenExist = await databaseService.verifications.findOne({ email_token })
    if (!emailTokenExist) {
      throw new NotFoundError()
    }
    const user_payload = await verifyToken<TDecodeEmailToken>({
      token: email_token,
      secretOrPublicKey: env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
    })
    const { email, full_name, password } = user_payload
    const user_verified = await databaseService.verifications.findOne({ email })
    if (!user_verified) {
      throw new NotFoundError()
    }
    const [access_token, refresh_token] = await this.signAPairToken({
      user_id,
      role: ROLE.CUSTOMER
    })
    const user = new User({
      _id: user_id,
      full_name,
      email,
      password,
      earn_point: 1
    })
    const token = new Token({ user_id, refresh_token: refresh_token })
    const cart = new Cart({ user_id, _id: new ObjectId() })
    const wishlist = new Wishlist({ user_id, _id: new ObjectId() })
    const result = await Promise.all([
      databaseService.users.insertOne(user),
      databaseService.tokens.insertOne(token),
      databaseService.wishlist.insertOne(wishlist),
      databaseService.carts.insertOne(cart),
      databaseService.verifications.deleteOne({ email_token })
    ])
    if (!result) {
      throw new InternalServerError()
    }
    return { access_token, refresh_token, role: ROLE.CUSTOMER }
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async login({ email, password }: TLoginReqBody) {
    const user = await databaseService.users.findOne({
      email,
      password: hashPassword(password)
    })
    if (!user) {
      throw new NotFoundError({ message: USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT })
    }

    const [access_token, refresh_token] = await this.signAPairToken({
      user_id: user?._id,
      role: user?.role!
    })

    const result = await databaseService.tokens.insertOne(
      new Token({ user_id: user._id, refresh_token: refresh_token })
    )
    if (!result) {
      throw new InternalServerError()
    }
    return {
      access_token,
      refresh_token,
      role: user?.role
    }
  }

  async logout(refresh_token: string) {
    const refreshTokenExist = await databaseService.tokens.findOne({ refresh_token })
    if (!refreshTokenExist) {
      throw new NotFoundError()
    }
    const result = await databaseService.tokens.deleteOne({ refresh_token })
    if (!result.acknowledged) {
      throw new InternalServerError()
    }
  }

  async forgotPassword(email: string) {
    const forgot_password_token = await this.signForgotPassword(email)
    const user = await databaseService.users.findOne({ email })
    if (!user) {
      throw new NotFoundError({ message: USERS_MESSAGES.EMAIL_NOT_EXIST })
    }
    const password_reset = new PasswordReset({
      user_id: user?._id,
      email: email,
      password_token: forgot_password_token
    })

    const insertResult = await databaseService.passwordResets.insertOne(password_reset)

    if (!insertResult.insertedId) {
      throw new InternalServerError()
    }
    await this.sendVerificationForgotPassword({
      email,
      token: forgot_password_token,
      type: EVerification.ForgotPassword
    })

    return {
      forgot_password_token
    }
  }

  async reSendForgot(email: string) {
    const user = await databaseService.users.findOne({ email })
    if (!user) {
      throw new NotFoundError()
    }

    const forgot_password_token = await this.signForgotPassword(email)

    const existingReset = await databaseService.passwordResets.findOne({ email })

    if (!existingReset) {
      throw new NotFoundError()
    }
    const result = await databaseService.passwordResets.updateOne(
      { email },
      { $set: { password_token: forgot_password_token, created_at: new Date() } }
    )
    if (!result.acknowledged) {
      throw new InternalServerError()
    }
    await this.sendVerificationForgotPassword({
      email,
      token: forgot_password_token,
      type: EVerification.ForgotPassword
    })

    return {
      forgot_password_token
    }
  }

  async resetPassword({ password, password_token }: TResetPasswordReqBody) {
    const existPasswordToken = await databaseService.passwordResets.findOne({
      password_token
    })

    if (!existPasswordToken) {
      throw new NotFoundError()
    }

    await verifyToken<TVerifyForgotReqBody>({
      token: password_token,
      secretOrPublicKey: env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
    })

    const user = await databaseService.users.findOne({
      _id: existPasswordToken.user_id
    })

    if (!user) {
      throw new NotFoundError()
    }

    const result = await databaseService.users.updateOne(
      {
        _id: user?._id
      },
      {
        $set: {
          password: hashPassword(password),
          created_at: new Date()
        }
      }
    )

    if (!result.acknowledged) {
      throw new InternalServerError()
    }

    await databaseService.passwordResets.deleteOne({ password_token })

    return {}
  }

  async refreshToken({ exp, user_id, role, refresh_token }: TRefreshTokenPayload) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id: new ObjectId(user_id), role }),
      this.signRefreshToken({ user_id: new ObjectId(user_id), role, exp })
    ])

    await databaseService.tokens.updateOne(
      { refresh_token },
      {
        $set: {
          refresh_token: new_refresh_token,
          created_at: new Date()
        }
      }
    )

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async getProfile(user_id: string) {
    const result = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!result) {
      throw new NotFoundError()
    }
    const { _id, email, role, full_name, phone, address, earn_point, total_paid } = result
    return { _id, email, role, full_name, phone, address, earn_point, total_paid }
  }

  async updateProfile({
    user_id,
    full_name,
    phone,
    address,
    total_order,
    total_paid,
    earn_point
  }: TUpdateProfilePayload) {
    const user = await this.getProfile(user_id)

    const updateQuery: Record<string, string | number | TAddress | Date> = {}

    updateQuery.updated_at = new Date()
    if (full_name) updateQuery.full_name = full_name
    if (phone) updateQuery.phone = phone
    if (address) updateQuery.address = address
    if (total_order) updateQuery.total_order = total_order
    if (total_paid) updateQuery.total_paid = total_paid + user.total_paid!
    if (earn_point) {
      const calculateEarnPoint = user.earn_point! + earn_point!
      updateQuery.earn_point = calculateEarnPoint
    }

    const result = await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: updateQuery
      }
    )

    if (!result.acknowledged || !result.modifiedCount) {
      throw new InternalServerError()
    }

    return this.getProfile(user_id) || {}
  }

  async getAllUser() {
    return (await databaseService.users.find().toArray()).reverse() || []
  }

  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return data as {
      access_token: string
      id_token: string
    }
  }

  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }

  async oauth(code: string) {
    const { id_token, access_token } = await this.getOauthGoogleToken(code)
    const userInfo = await this.getGoogleUserInfo(access_token, id_token)

    const user = await databaseService.users.findOne({ email: userInfo.email })
    if (user) {
      const [access_token, refresh_token] = await this.signAPairToken({
        user_id: user?._id,
        role: user?.role!
      })
      const result = await databaseService.tokens.insertOne(
        new Token({ user_id: user._id, refresh_token: refresh_token })
      )
      if (!result) {
        throw new InternalServerError()
      }
      return {
        access_token,
        refresh_token,
        role: user?.role
      }
    } else {
      const password = Math.random().toString(36).substring(2, 15)
      const user_id = new ObjectId()

      const [access_token, refresh_token] = await this.signAPairToken({
        user_id,
        role: ROLE.CUSTOMER
      })
      const user = new User({
        _id: user_id,
        full_name: userInfo.name,
        email: userInfo.email,
        password: hashPassword(password)
      })
      const token = new Token({ user_id, refresh_token: refresh_token })
      const cart = new Cart({ user_id })
      const wishlist = new Wishlist({ user_id })
      const result = await Promise.all([
        databaseService.users.insertOne(user),
        databaseService.tokens.insertOne(token),
        databaseService.wishlist.insertOne(wishlist),
        databaseService.carts.insertOne(cart)
      ])
      if (!result) {
        throw new InternalServerError()
      }
      return { access_token, refresh_token, role: ROLE.CUSTOMER }
    }
  }
}
const userServices = new UserServices()
export default userServices
