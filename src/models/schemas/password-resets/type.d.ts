import { ObjectId } from 'mongodb'

export type TPasswordResetProps = {
  _id?: ObjectId
  user_id: ObjectId
  email: string
  password_token: string
  created_at?: Date
  updated_at?: Date
}
