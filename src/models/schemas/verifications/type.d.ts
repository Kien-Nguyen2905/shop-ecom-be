import { ObjectId } from 'mongodb'

export type TVerificationProps = {
  _id?: ObjectId
  email: string
  email_token: string
  created_at?: Date
  updated_at?: Date
}
