import { ObjectId } from 'mongodb'
import { TWardProps } from '~/models/schemas/wards/type'

export default class Ward {
  _id: ObjectId
  name: string
  code: number
  division_type: string
  codename: string
  district_code: number
  constructor(province: TWardProps) {
    this._id = province._id
    this.name = province.name
    this.code = province.code
    this.division_type = province.division_type
    this.codename = province.codename
    this.district_code = province.district_code
  }
}
