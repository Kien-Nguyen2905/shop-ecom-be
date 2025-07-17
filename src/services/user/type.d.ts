import { ObjectId } from 'mongodb'
import { ROLE, Verify } from '~/constants/enum'
import { TAddessProps, TWishList } from '~/models/schemas/users/type'

export type TTokenPayload = {
  user_id: string
  role: ROLE
  exp: number
  iat: number
}
export type TVerifyReqBody = {
  full_name: string
  email: string
  password: string
  confirm_password: string
}
export type TRegisterReqBody = {
  full_name: string
  email: string
  password: string
  confirm_password: string
}
export type TReSendVerifyReqBody = {
  email: string
}
export type TLoginReqBody = {
  email: string
  password: string
}
export type TDecodeEmailToken = Omit<TRegisterReqBody, 'confirm_password'>
export type TVerifyForgotReqBody = {
  password_token: string
}
export type TResetPasswordReqBody = {
  password: string
  confirm_password: string
  password_token: string
}
export type TRefreshTokenPayload = {
  user_id: string
  role: ROLE
  exp: number
  refresh_token: strig
}

export type TAddress = {
  province?: string
  district?: string
  ward?: string
  street_address?: string
}
export type TUpdateProfilePayload = {
  user_id: string
  full_name?: string
  phone?: string
  address?: TAddress
  earn_point?: number
  total_order?: number
  total_paid?: number
}
export type TProfilePayload = {}
export interface IAccessToken {
  user_id: ObjectId
  role: ROLE
}
export interface IRefreshToken extends IAccessToken {
  exp?: number
}
export interface ITokenVerify extends IRefreshToken {
  iat: number
}
export type TVerificationEmail = {
  email: string
  token: string
  type: Verification
}
