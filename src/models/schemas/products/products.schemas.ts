import { ObjectId } from 'mongodb'
import { TFeatured, TProductProps, TVariant } from '~/models/schemas/products/type'

export default class Product {
  _id?: ObjectId
  name: string
  category_id: ObjectId
  brand_id: ObjectId
  thumbnail: string
  description: string
  featured?: TFeatured
  variants: TVariant[]
  minimum_stock: number
  rate: number
  attributes?: Record<string, string | []>
  created_at: Date
  updated_at: Date

  constructor(product: TProductProps) {
    const date = new Date()
    this._id = product._id
    this.name = product.name
    this.category_id = product.category_id
    this.brand_id = product.brand_id
    this.thumbnail = product.thumbnail || ''
    this.description = product.description || ''
    this.featured = product.featured || { isPopular: false, onSale: false, isRated: false }
    this.variants = product.variants || []
    this.minimum_stock = product.minimum_stock
    this.attributes = product.attributes || {}
    this.rate = product.rate || 0
    this.created_at = product.created_at || date
    this.updated_at = product.updated_at || date
  }
}
