import { ObjectId } from 'mongodb'
import { STATUS_ORDER, TYPE_PAYMENT } from '~/constants/enum'
import { TAddessProps } from '~/models/schemas/users/type'

export type TProductOrderProps = {
  product_id: ObjectId
  variant_id: ObjectId
  image: string
  name: string
  color: string
  price: number
  discount: number
  quantity: number
  isReviewed: boolean
}
export type TOrderProps = {
  _id?: ObjectId
  user_id: ObjectId
  products: TProductOrderProps[]
  total: number
  earn_point: number
  type_payment: TYPE_PAYMENT
  note?: string
  address: TAddessProps
  phone: string
  status: STATUS_ORDER
  created_at?: Date
  updated_at?: Date
}
