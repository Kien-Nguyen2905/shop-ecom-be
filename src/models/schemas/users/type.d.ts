import { ObjectId } from 'mongodb'
import { UserVerify } from '~/constants/enum'

export type TAddessProps = {
  province?: string
  district?: string
  ward?: string
  street_address?: string
}

export type TUserProps = {
  _id?: ObjectId
  email: string
  password: string
  role?: ROLE
  full_name?: string
  phone?: string
  address?: TAddessProps
  earn_point?: number
  total_order?: number
  total_paid?: number
  created_at?: Date
  updated_at?: Date
}
