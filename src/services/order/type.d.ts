import { STATUS_ORDER, TYPE_PAYMENT } from '~/constants/enum'
import { TProductCartProps } from '~/models/schemas/carts/type'
import { TAddress } from '~/services/user/type'

export type TProductOrder = {
  product_id: string
  image: string
  name: string
  variant_id: string
  color: string
  price: number
  discount: number
  quantity: number
}

export type TCreateOrderPayload = {
  user_id: string
  products: TProductOrder[]
  type_payment: TYPE_PAYMENT
  note?: string
  address?: TAddress
  earn_point?: number
  phone: string
  content?: string
}
export type TUpdateStatusOrderPayload = {
  order_id: string
  status: STATUS_ORDER
}
export type TFindVariantUnreview = {
  order_id: string
  variant_id: string
}
