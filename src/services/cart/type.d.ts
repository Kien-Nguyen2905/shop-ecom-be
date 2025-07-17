export type TUpdateCartPayload = {
  product_id: string
  variant_id: string
  quantity: number
  user_id: string
}
export type TRemoveItemCartPayload = {
  user_id: string
  item_id: string
}
