import { ObjectId } from 'mongodb'

export type TLapAttributes = {
  cpu: string
  ram: string
  os: string
  screen: number
  weight: number
  pin: string
  demand: string[]
}
export type TLapAttributes = {
  cpu: string
  ram: string
  os: string
  screen: number
  weight: number
  pin: string
  demand: string[]
}
export type TInformationProps = {
  _id?: ObjectId
  category_id: ObjectId
  attributes: {}
  created_at?: Date
  updated_at?: Date
}
