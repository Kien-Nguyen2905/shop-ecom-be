export type TCreateReviewPayload = {
  user_id: string
  order_id: string
  product_id: string
  variant_id: string
  title: string
  description: string
  rate: number
}
