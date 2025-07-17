import { TLapAttributes } from '~/models/schemas/informations/type'
import { TFeatured, TVariant } from '~/models/schemas/products/type'

export type TProductPayload = {
  name: string
  category_id: string
  brand_id: string
  thumbnail: string
  description: string
  featured: TFeatured
  variants: TVariant[]
  minimum_stock: number
  attributes: Record<string, string | []>
}

export type TUpdateProductPayload = {
  name: string
  category_id: string
  brand_id: string
  thumbnail: string
  featured: TFeatured
  minimum_stock: number
  description: string
  variants: TVariant[]
  attributes: Record<string, string | []>
}
export type TProductQuery = {
  page?: string
  limit?: string
  orderBy?: string
  order?: 'asc' | 'desc'
  dateFrom?: string
  dateTo?: string
  search?: string
  category?: string | string[]
  popular?: 'true' | 'false'
  onSale?: 'true' | 'false'
  topRated?: 'true' | 'false'
  minPrice?: string
  maxPrice?: string
  outOfStockLimit?: string
  inStock: ?string
}
