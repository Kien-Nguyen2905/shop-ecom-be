import { ObjectId } from 'mongodb'

export type TTokenProps = {
  _id?: ObjectId
  user_id: ObjectId
  refresh_token: string
  created_at?: Date
  updated_at?: Date
}
