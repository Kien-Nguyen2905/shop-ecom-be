import { ObjectId } from 'mongodb'
export type TShipment = {
  shipment_date: Date
  quantity: number
}
export type TWarehouseProps = {
  _id?: ObjectId
  product_id: ObjectId
  product_name: string
  variant: string
  variant_id: ObjectId
  sold?: number
  import_quantity: number
  stock?: number
  minimum_stock: number
  shipments: TShipment[]
  isDeleted?: boolean
  created_at?: Date
  updated_at?: Date
}
