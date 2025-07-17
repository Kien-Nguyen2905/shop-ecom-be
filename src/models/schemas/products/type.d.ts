import { ObjectId } from 'mongodb'

export type TFeatured = {
  isPopular: boolean
  onSale: boolean
  isRated: boolean
}
export type TVariant = {
  _id: ObjectId
  index: number
  color: string
  price: number
  stock: number
  sold: number
  images: string[]
  discount: number
}
export type TProductProps = {
  _id?: ObjectId
  name: string
  category_id: ObjectId
  brand_id: ObjectId
  thumbnail: string
  description: string
  featured: TFeatured
  variants: TVariant[]
  minimum_stock: number
  rate: number
  attributes: Record<string, string | []>
  created_at?: Date
  updated_at?: Date
}
