import { ObjectId } from 'mongodb'
import { TVerificationProps } from '~/models/schemas/verifications/type'

export default class Verification {
  _id?: ObjectId
  email: string
  email_token: string
  created_at?: Date
  updated_at?: Date
  constructor(verification: TVerificationProps) {
    const date = new Date()
    this._id = verification._id
    this.email = verification.email
    this.email_token = verification.email_token
    this.created_at = verification.created_at || date
    this.updated_at = verification.updated_at || date
  }
}
