import axios from 'axios'
import { ObjectId } from 'mongodb'
import { env } from 'process'
import { STATUS_TRANSACTION, TYPE_PAYMENT } from '~/constants/enum'
import { InternalServerError } from '~/models/errors/errors'
import Transaction from '~/models/schemas/transactions/transactions.schemas'
import databaseService from '~/services/database/database.services'
import {
  TCreateTransactionPayload,
  TTransaction,
  TTransactionResponse,
  TTransactionSepayQuery,
  TWebhookData
} from '~/services/transaction/type'

class TransactionServices {
  async createTransaction({ user_id, type_payment, value, content }: TCreateTransactionPayload) {
    const _id = new ObjectId()
    const transaction = new Transaction({
      _id,
      user_id: new ObjectId(user_id),
      type_payment,
      order_id: new ObjectId(),
      status: STATUS_TRANSACTION.SUCCESS,
      method_payment: type_payment ? 'BANKING' : 'COD',
      value,
      content
    })
    const result = await databaseService.transactions.insertOne(transaction)
    if (!result.acknowledged || !result.insertedId) {
      throw new InternalServerError()
    }
    return this.getTransactionById(_id.toString()) || {}
  }

  async getTransactionById(_id: string) {
    return (databaseService.transactions.findOne({ _id: new ObjectId(_id) }) as {}) || {}
  }

  async getTransactionSePay({ content, value, user_id }: TTransactionSepayQuery) {
    const response = await axios.get('https://my.sepay.vn/userapi/transactions/list', {
      params: {
        limit: 3
      },
      headers: {
        Authorization: `Bearer ${env.SEPAY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    if (response.data.status === 200 && response.data.transactions) {
      const transactions = response.data.transactions
      const filteredTransactions = transactions.filter(
        (tx: any) =>
          tx.transaction_content &&
          tx.transaction_content.includes(content) &&
          parseFloat(tx.amount_in) === Number(value)
      )
      if (filteredTransactions.length > 0) {
        const order_id = new ObjectId()
        const orderArgument = {
          type: 'BANKING',
          user_id,
          order_id: order_id.toString(),
          type_payment: TYPE_PAYMENT.BANKING,
          value: Number(value),
          content
        }
        return await this.createTransaction(orderArgument)
      }
    } else {
      throw new InternalServerError()
    }
  }

  async getTransaction() {
    return (
      ((await databaseService.transactions.find().sort({ updated_at: -1 }).toArray()) as TTransactionResponse) || []
    )
  }

  async getTransactionByOrder(order_id: string) {
    return ((await databaseService.transactions.findOne({ order_id: new ObjectId(order_id) })) as TTransaction) || {}
  }

  async validateSePayWebhook(res: TWebhookData) {
    const transactionList = await databaseService.transactions
      .find({
        value: res.transferAmount,
        status: STATUS_TRANSACTION.PENDING,
        type_payment: TYPE_PAYMENT.BANKING
      })
      .toArray()
    if (transactionList) {
      const transaction = transactionList.find((item) => res.content.includes(item.content || ''))
      if (transaction) {
        await databaseService.transactions.updateOne(
          { _id: transaction._id },
          {
            $set: {
              status: STATUS_TRANSACTION.SUCCESS,
              updated_at: new Date()
            }
          }
        )
        await databaseService.orders.updateOne(
          { _id: new ObjectId(transaction.order_id) },
          {
            $set: {
              created_at: new Date()
            }
          }
        )
      }
    }
  }

  async getRevenue(year: string) {
    const matchStage = year
      ? {
          $match: {
            status: STATUS_TRANSACTION.SUCCESS,
            created_at: {
              $gte: new Date(`${year}-01-01T00:00:00.000Z`),
              $lte: new Date(`${year}-12-31T23:59:59.999Z`)
            }
          }
        }
      : {}

    const revenueData = await databaseService.transactions
      .aggregate([
        matchStage,
        {
          $group: {
            _id: { $month: '$created_at' },
            totalRevenue: { $sum: '$value' }
          }
        },
        { $sort: { _id: 1 } }
      ])
      .toArray()
    return revenueData.map((item) => ({
      month: new Date(0, item._id - 1).toLocaleString('en-US', { month: 'long' }),
      revenue: item.totalRevenue
    }))
  }
}

const transactionServices = new TransactionServices()

export default transactionServices
