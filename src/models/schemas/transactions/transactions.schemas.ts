import { ObjectId } from 'mongodb'
import { STATUS_TRANSACTION, TYPE_PAYMENT } from '~/constants/enum'
import { TTransactionProps } from '~/models/schemas/transactions/type'

export default class Transaction {
  _id?: ObjectId
  user_id: ObjectId
  order_id: ObjectId
  type_payment: TYPE_PAYMENT
  status: STATUS_TRANSACTION
  method_payment: string
  value: number
  content?: string
  created_at?: Date
  updated_at?: Date
  constructor(transaction: TTransactionProps) {
    const date = new Date()
    this._id = transaction._id
    this.user_id = transaction.user_id
    this.order_id = transaction.order_id
    this.type_payment = transaction.type_payment
    this.status = transaction.status
    this.method_payment = transaction.method_payment
    this.value = transaction.value
    this.content = transaction.content || ''
    this.created_at = transaction.created_at || date
    this.updated_at = transaction.updated_at || date
  }
}
