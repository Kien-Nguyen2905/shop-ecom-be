import { ObjectId } from 'mongodb'
import { TTokenProps } from '~/models/schemas/tokens/type'

export default class Token {
  _id?: ObjectId
  user_id: ObjectId
  refresh_token: string
  created_at?: Date
  updated_at?: Date
  constructor(token: TTokenProps) {
    const date = new Date()
    this._id = token._id
    this.user_id = token.user_id
    this.refresh_token = token.refresh_token
    this.created_at = token.created_at || date
    this.updated_at = token.updated_at || date
  }
}
