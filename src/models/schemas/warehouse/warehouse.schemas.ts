import { ObjectId } from 'mongodb'
import { TShipment, TWarehouseProps } from '~/models/schemas/warehouse/type'

export default class Warehouse {
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
  constructor(warehouse: TWarehouseProps) {
    const date = new Date()
    this._id = warehouse._id
    this.product_id = warehouse.product_id
    this.product_name = warehouse.product_name
    this.variant = warehouse.variant
    this.variant_id = warehouse.variant_id
    this.sold = warehouse.sold || 0
    this.import_quantity = warehouse.import_quantity
    this.stock = warehouse.stock || warehouse.import_quantity
    this.minimum_stock = warehouse.minimum_stock
    this.shipments = warehouse.shipments
    this.isDeleted = warehouse.isDeleted || false
    this.created_at = warehouse.created_at || date
    this.updated_at = warehouse.updated_at || date
  }
}
