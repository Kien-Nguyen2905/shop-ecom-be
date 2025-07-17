import brandServices from '~/services/brand/brand.services'
import { BadRequestError, ConflictRequestError, InternalServerError, NotFoundError } from '~/models/errors/errors'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database/database.services'
import { BRAND_MESSAGES } from '~/constants/message'

jest.mock('~/services/database/database.services.ts', () => ({
  __esModule: true,
  default: {
    brands: {
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn()
    },
    products: {
      findOne: jest.fn()
    }
  }
}))

describe('BrandServices', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createBrand', () => {
    it('should throw ConflictRequestError if the brand already exists', async () => {
      // Mocking the scenario where the brand exists
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce({ name: 'Apple' }) // name exist in DB

      await expect(brandServices.createBrand('Apple')).rejects.toThrow(
        new ConflictRequestError({ message: BRAND_MESSAGES.BRAND_NAME_EXISTS })
      )
    })

    it('should create a new brand', async () => {
      const mockBrand = { _id: new ObjectId(), name: 'New Brand' }

      // Mocking the `findOne` method to return `null` (brand does not exist)
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce(null)

      // Mocking successful insertion into the database
      ;(databaseService.brands.insertOne as jest.Mock).mockResolvedValueOnce({
        acknowledged: true,
        insertedId: mockBrand._id
      })

      // Mocking `getBrandById` to return the created brand
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce(mockBrand)

      // Call the createBrand method
      const brand = await brandServices.createBrand('New Brand')

      // Assert the brand has the expected properties
      expect(brand).toHaveProperty('name', 'New Brand')
      expect(brand).toHaveProperty('_id', mockBrand._id)
    })

    it('should throw InternalServerError if the insert fails', async () => {
      // Mocking the scenario where insertion fails
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce({ name: 'New Brand' })

      await expect(brandServices.createBrand('New Brand')).rejects.toThrow(
        new ConflictRequestError({ message: BRAND_MESSAGES.BRAND_NAME_EXISTS })
      )
    })
  })

  describe('updateBrand', () => {
    it('should throw BadRequestError if name is not provided', async () => {
      await expect(brandServices.updateBrand({ _id: 'some_id', name: '' })).rejects.toThrow(new BadRequestError())
    })

    it('should throw NotFoundError if brand does not exist', async () => {
      const mockId = new ObjectId().toHexString()

      // Mocking the scenario where no brand is found
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce(null)

      await expect(brandServices.updateBrand({ _id: mockId, name: 'Updated Brand' })).rejects.toThrow(
        new NotFoundError({ message: BRAND_MESSAGES.BRAND_NOT_EXISTS })
      )
    })

    it('should update the brand and return updated brand', async () => {
      const mockId = new ObjectId().toHexString()
      const mockBrand = { _id: mockId, name: 'Old Brand' }

      // Mocking the scenario where the brand exists
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce(mockBrand)

      // Mocking successful update
      ;(databaseService.brands.updateOne as jest.Mock).mockResolvedValueOnce({
        acknowledged: true,
        modifiedCount: 1
      })

      // Mocking the updated brand to return
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce({
        _id: mockId,
        name: 'Updated Brand'
      })

      const result = await brandServices.updateBrand({ _id: mockId, name: 'Updated Brand' })

      expect(result).toHaveProperty('name', 'Updated Brand')
      expect(result).toHaveProperty('_id', mockId)
    })

    it('should throw InternalServerError if update fails', async () => {
      const mockId = new ObjectId().toHexString()
      const mockBrand = { _id: mockId, name: 'Old Brand' }

      // Mocking the scenario where the brand exists
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce(mockBrand)

      // Mocking failed update
      ;(databaseService.brands.updateOne as jest.Mock).mockResolvedValueOnce({
        acknowledged: false,
        modifiedCount: 0
      })

      await expect(brandServices.updateBrand({ _id: mockId, name: 'Updated Brand' })).rejects.toThrow(
        new InternalServerError()
      )
    })
  })

  describe('getBrandById', () => {
    it('should throw NotFoundError if brand is not found', async () => {
      const nonExistingId = new ObjectId().toHexString()

      // Mocking the scenario where no brand is found
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce(null)

      await expect(brandServices.getBrandById(nonExistingId)).rejects.toThrow(
        new NotFoundError({ message: BRAND_MESSAGES.BRAND_NOT_EXISTS })
      )
    })

    it('should return the brand when found', async () => {
      const mockBrand = { _id: new ObjectId().toHexString(), name: 'Apple' }

      // Mocking the scenario where the brand is found
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce(mockBrand)

      const result = await brandServices.getBrandById(mockBrand._id)
      expect(result).toEqual(mockBrand)
    })
  })

  describe('deleteBrand', () => {
    it('should throw NotFoundError if brand does not exist', async () => {
      const mockId = new ObjectId().toHexString()

      // Mocking the scenario where no brand is found
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce(null)

      await expect(brandServices.deleteBrand(mockId)).rejects.toThrow(
        new NotFoundError({ message: BRAND_MESSAGES.BRAND_NOT_EXISTS })
      )
    })

    it('should delete the brand successfully without returning a message', async () => {
      const mockId = new ObjectId().toHexString()
      const mockBrand = { _id: mockId, name: 'Brand to Delete' }

      // Mocking the scenario where the brand exists
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce(mockBrand)

      // Mocking successful deletion
      ;(databaseService.brands.deleteOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true, deletedCount: 1 })

      // Run the deleteBrand method
      await expect(brandServices.deleteBrand(mockId)).resolves.not.toThrow()

      // Check if deleteOne was called with the correct parameters
      expect(databaseService.brands.deleteOne).toHaveBeenCalledWith({ _id: new ObjectId(mockId) })
    })

    it('should throw InternalServerError if deletion fails', async () => {
      const mockId = new ObjectId().toHexString()
      const mockBrand = { _id: mockId, name: 'Brand to Delete' }

      // Mocking the scenario where the brand exists
      ;(databaseService.brands.findOne as jest.Mock).mockResolvedValueOnce(mockBrand)

      // Mocking failed deletion
      ;(databaseService.brands.deleteOne as jest.Mock).mockResolvedValueOnce({ acknowledged: false, deletedCount: 0 })

      await expect(brandServices.deleteBrand(mockId)).rejects.toThrow(new InternalServerError())
    })
  })
})
