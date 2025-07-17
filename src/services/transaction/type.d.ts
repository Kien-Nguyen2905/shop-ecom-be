import { ObjectId } from 'mongodb'
import { STATUS_ORDER, STATUS_TRANSACTION, TYPE_PAYMENT } from '~/constants/enum'

export type TCreateTransactionPayload = {
  user_id: string
  type_payment: TYPE_PAYMENT
  value: number
  content?: string
}

export type TTransactionSepayQuery = {
  content: string
  value: string
  user_id: string
}

export type TTransaction = {
  _id: ObjectId
  user_id: ObjectId
  order_id: ObjectId
  type_payment: TYPE_PAYMENT
  status: STATUS_TRANSACTION
  method_payment: string
  value: number
  content: string
  created_at: Date
  updated_at: Date
}

export type TWebhookData = {
  gateway: string
  transactionDate: string
  accountNumber: string
  subAccount: string | null
  code: string | null
  content: string
  transferType: 'in' | 'out'
  description: string
  transferAmount: number
  referenceCode: string
  accumulated: number
  id: number
}
export type TTransactionResponse = TTransaction[]
