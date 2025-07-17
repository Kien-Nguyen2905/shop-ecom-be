import { ObjectId } from 'mongodb'
import { TProvinceProps } from '~/models/schemas/provinces/type'

export default class Province {
  _id: ObjectId
  name: string
  code: number
  division_type: string
  codename: string
  phone_code: number
  constructor(province: TProvinceProps) {
    this._id = province._id
    this.name = province.name
    this.code = province.code
    this.division_type = province.division_type
    this.codename = province.codename
    this.phone_code = province.phone_code
  }
}
