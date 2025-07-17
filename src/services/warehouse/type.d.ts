import { ObjectId } from 'mongodb'
export type TShipment = {
  shipment_date: Date
  quantity: number
}
export type TWarehousePayload = {
  product_id: string
  product_name: string
  variant: string
  variant_id: string
  import_quantity: number
  minimum_stock: number
  shipments: TShipment[]
}

export type TUpdateWarehousePayload = {
  product_id: string
  product_name: string
  variant: string
  variant_id: string
  import_quantity: number
  minimum_stock: number
}
export type TWarehouseUpdatePayload = {
  id: string
  quantity: number
  product_id: string
  variant_id: string
}
