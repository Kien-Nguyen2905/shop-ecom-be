import { BadRequestError } from '~/models/errors/errors'
import databaseService from '~/services/database/database.services'

class AddressServices {
  async getProvinces() {
    return (await databaseService.provinces.find().toArray()) || []
  }

  async getDistrictsByProvince(province_code?: string) {
    if (province_code) return (await databaseService.districts.find({ province_code: +province_code }).toArray()) || []
    return (await databaseService.districts.find().toArray()) || []
  }

  async getWardsByDistrict(district_code?: string) {
    if (district_code) return (await databaseService.wards.find({ district_code: +district_code }).toArray()) || []
    return (await databaseService.wards.find().toArray()) || []
  }
}
const addressServices = new AddressServices()
export default addressServices
