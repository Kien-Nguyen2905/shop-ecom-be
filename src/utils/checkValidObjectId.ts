import { ObjectId } from 'mongodb'
import { BadRequestError } from '~/models/errors/errors'

export const isInValidId = (id: string) => {
  if (!ObjectId.isValid(id)) {
    throw new BadRequestError()
  }
  return true
}
export const idObjectInvalid = ({ id, validation = false }: { id: string; validation?: boolean }) => {
  if (validation) {
    if (!ObjectId.isValid(id)) {
      throw new Error()
    }
    return true
  } else {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestError()
    }
    return true
  }
}
