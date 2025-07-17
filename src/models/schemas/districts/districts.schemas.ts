import { ObjectId } from 'mongodb'
import { TDistrictProps } from '~/models/schemas/districts/type'

export default class District {
  _id?: ObjectId
  name: string
  code: number
  division_type: string
  codename: string
  province_code: number
  constructor(province: TDistrictProps) {
    this._id = province._id
    this.name = province.name
    this.code = province.code
    this.division_type = province.division_type
    this.codename = province.codename
    this.province_code = province.province_code
  }
}
