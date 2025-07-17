import { ObjectId } from 'mongodb'
import { CATEGORY_MESSAGES } from '~/constants/message'
import { BadRequestError, InternalServerError, NotFoundError } from '~/models/errors/errors'
import Information from '~/models/schemas/informations/informations.schemas'
import databaseService from '~/services/database/database.services'
import categoryServices from '~/services/category/category.services'
import { TCreateInformationPayload, TUpdateInformationPayload } from '~/services/infomation/type'

class InformationService {
  async createInformation({ attributes, category_id }: TCreateInformationPayload) {
    const existingCategory = await categoryServices.getCategoryById(category_id)

    if (!existingCategory) {
      throw new NotFoundError({ message: 'Exist information of the category' })
    }

    const information = new Information({ category_id: new ObjectId(category_id), attributes })
    const result = await databaseService.informations.insertOne(information)

    if (!result.acknowledged || !result.insertedId) {
      throw new InternalServerError()
    }

    return await this.getInformationByCategory(category_id)
  }

  async getInformationByCategory(category_id: string) {
    const result = await databaseService.informations.findOne({ category_id: new ObjectId(category_id) })
    if (!result) {
      throw new BadRequestError()
    }
    return result
  }

  async updateInformation({ _id, attributes, category_id }: TUpdateInformationPayload) {
    const existingCategory = await categoryServices.getCategoryById(category_id)

    if (!existingCategory) {
      throw new NotFoundError({ message: CATEGORY_MESSAGES.CATEGORY_NOT_EXISTS })
    }

    await this.getInformationByCategory(category_id)

    await this.getInformationById(_id)

    const result = await databaseService.informations.updateOne(
      { _id: new ObjectId(_id), category_id: new ObjectId(category_id) },
      {
        $set: {
          attributes,
          category_id: new ObjectId(category_id),
          updated_at: new Date()
        }
      }
    )

    if (!result.acknowledged || !result.modifiedCount) {
      throw new InternalServerError()
    }

    return this.getInformationByCategory(category_id)
  }

  async deleteInformation(_id: string) {
    this.getInformationById(_id)

    const result = await databaseService.informations.deleteOne({ _id: new ObjectId(_id) })

    if (!result.acknowledged || !result.deletedCount) {
      throw new InternalServerError()
    }
  }

  async getInformationById(_id: string) {
    const information = await databaseService.informations.findOne({ _id: new ObjectId(_id) })
    if (!information) {
      throw new NotFoundError({ message: 'Information not found' })
    }
    return information
  }
}

const informationServices = new InformationService()

export default informationServices
