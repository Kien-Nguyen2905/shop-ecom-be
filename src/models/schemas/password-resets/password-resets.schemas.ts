import { ObjectId } from 'mongodb'
import { TPasswordResetProps } from '~/models/schemas/password-resets/type'

export default class PasswordReset {
  _id?: ObjectId
  user_id: ObjectId
  email: string
  password_token: string
  created_at?: Date
  updated_at?: Date
  constructor(reset: TPasswordResetProps) {
    const date = new Date()
    this._id = reset._id
    this.user_id = reset.user_id
    this.email = reset.email
    this.password_token = reset.password_token
    this.created_at = reset.created_at || date
    this.updated_at = reset.updated_at || date
  }
}
