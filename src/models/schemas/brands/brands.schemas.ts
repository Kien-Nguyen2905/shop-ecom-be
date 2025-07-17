import { ObjectId } from 'mongodb'
import { TBrandProps } from '~/models/schemas/brands/type'

export default class Brand {
  _id?: ObjectId
  name: string
  created_at?: Date
  updated_at?: Date
  constructor(category: TBrandProps) {
    const date = new Date()
    this._id = category._id
    this.name = category.name
    this.created_at = category.created_at || date
    this.updated_at = category.updated_at || date
  }
}
