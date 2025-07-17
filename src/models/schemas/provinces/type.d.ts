import { ObjectId } from 'mongodb'

export type TProvinceProps = {
  _id: ObjectId
  name: string
  code: number
  division_type: string
  codename: string
  phone_code: number
}
