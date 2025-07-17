import { ObjectId } from 'mongodb'
import { ROLE } from '~/constants/enum'
import { TAddessProps, TUserProps } from '~/models/schemas/users/type'

export default class User {
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
  constructor(user: TUserProps) {
    const date = new Date()
    this._id = user._id
    this.email = user.email
    this.password = user.password
    this.role = user.role || ROLE.CUSTOMER
    this.full_name = user.full_name || ''
    this.phone = user.phone || ''
    this.address = user.address || {}
    this.earn_point = user.earn_point || 0
    this.total_order = user.total_order || 0
    this.total_paid = user.total_paid || 0
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
}
