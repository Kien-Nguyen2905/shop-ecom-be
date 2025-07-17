import { ObjectId } from 'mongodb'
import { BRAND_MESSAGES } from '~/constants/message'
import { BadRequestError, ConflictRequestError, InternalServerError, NotFoundError } from '~/models/errors/errors'
import Brand from '~/models/schemas/brands/brands.schemas'
import { TBrandProps } from '~/models/schemas/brands/type'
import { TBrandPayload } from '~/services/brand/type'
import databaseService from '~/services/database/database.services'
import productServices from '~/services/product/product.services'

class BrandServices {
  async createBrand(name: string) {
    await this.checkBrandExist(name)

    const _id = new ObjectId()
    const brand = new Brand({ _id, name })

    const result = await databaseService.brands.insertOne(brand)
    if (!result.acknowledged || !result.insertedId) {
      throw new InternalServerError()
    }

    return this.getBrandById(_id.toString())
  }

  async updateBrand({ _id, name }: TBrandPayload) {
    if (!name) {
      throw new BadRequestError()
    }
    const brandUpdate = await this.getBrandById(_id)

    const result = await databaseService.brands.updateOne(
      { _id: brandUpdate._id },
      {
        $set: {
          name,
          updated_at: new Date()
        }
      }
    )

    if (!result.acknowledged || !result.modifiedCount) {
      throw new InternalServerError()
    }

    return this.getBrandById(_id) || {}
  }

  async getBrands() {
    return (await databaseService.brands.find().toArray()).reverse() || []
  }

  async getBrandById(_id: string) {
    const result = (await databaseService.brands.findOne({ _id: new ObjectId(_id) })) as TBrandProps
    if (!result) {
      throw new NotFoundError({ message: BRAND_MESSAGES.BRAND_NOT_EXISTS })
    }
    return result
  }

  async deleteBrand(_id: string) {
    await this.checkBrandBelongProduct(_id)

    await this.getBrandById(_id)

    const result = await databaseService.brands.deleteOne({ _id: new ObjectId(_id) })
    if (!result.acknowledged || !result.deletedCount) {
      throw new InternalServerError()
    }
  }

  async checkBrandExist(name: string) {
    const result = await databaseService.brands.findOne({ name: name })
    if (result) {
      throw new ConflictRequestError({
        message: BRAND_MESSAGES.BRAND_NAME_EXISTS
      })
    }
  }

  async checkBrandBelongProduct(_id: string) {
    const checkProductExist = await productServices.checkProductByBrand(_id)
    if (checkProductExist) {
      throw new ConflictRequestError({ message: BRAND_MESSAGES.BRAND_BELONG_TO_EXIST_PRODUCT })
    }
  }
}

const brandServices = new BrandServices()
export default brandServices
