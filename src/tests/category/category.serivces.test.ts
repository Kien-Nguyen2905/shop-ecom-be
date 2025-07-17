import categoryServices from '~/services/category/category.services'
import databaseService from '~/services/database/database.services'
import productServices from '~/services/product/product.services'
import { BadRequestError, ConflictRequestError, InternalServerError, NotFoundError } from '~/models/errors/errors'
import { CATEGORY_MESSAGES } from '~/constants/message'
import { ObjectId } from 'mongodb'

jest.mock('~/services/database/database.services', () => ({
  __esModule: true,
  default: {
    categories: {
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      find: jest.fn(() => ({ toArray: jest.fn() }))
    },
    informations: {
      deleteOne: jest.fn()
    }
  }
}))

jest.mock('~/services/product/product.services', () => ({
  __esModule: true,
  default: {
    checkProductByCategory: jest.fn()
  }
}))

describe('CategoryServices', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createCategory', () => {
    it('should throw ConflictRequestError if category already exists', async () => {
      ;(databaseService.categories.findOne as jest.Mock).mockResolvedValueOnce({ name: 'Electronics' })

      await expect(categoryServices.createCategory('Electronics')).rejects.toThrow(
        new ConflictRequestError({ message: CATEGORY_MESSAGES.CATEGORY_NAME_EXISTS })
      )
    })

    it('should create a new category', async () => {
      const mockCategory = { _id: new ObjectId(), name: 'Electronics' }
      ;(databaseService.categories.findOne as jest.Mock).mockResolvedValueOnce(null)
      ;(databaseService.categories.insertOne as jest.Mock).mockResolvedValueOnce({
        acknowledged: true,
        insertedId: mockCategory._id
      })
      ;(databaseService.categories.findOne as jest.Mock).mockResolvedValueOnce(mockCategory)

      const result = await categoryServices.createCategory('Electronics')
      expect(result).toEqual(mockCategory)
    })

    it('should throw InternalServerError if insertion fails', async () => {
      ;(databaseService.categories.findOne as jest.Mock).mockResolvedValueOnce(null)
      ;(databaseService.categories.insertOne as jest.Mock).mockResolvedValueOnce({
        acknowledged: false,
        insertedId: null
      })

      await expect(categoryServices.createCategory('Electronics')).rejects.toThrow(InternalServerError)
    })
  })

  describe('updateCategory', () => {
    it('should throw NotFoundError if category does not exist', async () => {
      ;(databaseService.categories.findOne as jest.Mock).mockResolvedValueOnce(null)

      await expect(
        categoryServices.updateCategory({ _id: new ObjectId().toHexString(), name: 'Updated Category' })
      ).rejects.toThrow(new NotFoundError({ message: CATEGORY_MESSAGES.CATEGORY_NOT_EXISTS }))
    })

    it('should update the category successfully', async () => {
      const mockCategory = { _id: new ObjectId(), name: 'Old Category' }
      ;(databaseService.categories.findOne as jest.Mock).mockResolvedValueOnce(mockCategory)
      ;(databaseService.categories.updateOne as jest.Mock).mockResolvedValueOnce({
        acknowledged: true,
        modifiedCount: 1
      })
      ;(databaseService.categories.findOne as jest.Mock).mockResolvedValueOnce({
        _id: mockCategory._id,
        name: 'Updated Category'
      })

      const result = await categoryServices.updateCategory({
        _id: mockCategory._id.toHexString(),
        name: 'Updated Category'
      })
      expect(result.name).toBe('Updated Category')
    })
  })

  describe('getCategory', () => {
    it('should return all categories in reverse order', async () => {
      const mockCategories = [{ name: 'Category1' }, { name: 'Category2' }]
      ;(databaseService.categories.find().sort({ created_at: -1 }).toArray as jest.Mock).mockResolvedValueOnce(
        mockCategories
      )

      const result = await categoryServices.getCategory()
      expect(result).toEqual(mockCategories)
    })
  })

  describe('getCategoryById', () => {
    it('should throw NotFoundError if category does not exist', async () => {
      ;(databaseService.categories.findOne as jest.Mock).mockResolvedValueOnce(null)

      await expect(categoryServices.getCategoryById(new ObjectId().toHexString())).rejects.toThrow(
        new NotFoundError({ message: CATEGORY_MESSAGES.CATEGORY_NOT_EXISTS })
      )
    })

    it('should return the category if it exists', async () => {
      const mockCategory = { _id: new ObjectId(), name: 'Category1' }
      ;(databaseService.categories.findOne as jest.Mock).mockResolvedValueOnce(mockCategory)

      const result = await categoryServices.getCategoryById(mockCategory._id.toHexString())
      expect(result).toEqual(mockCategory)
    })
  })

  describe('deleteCategory', () => {
    it('should throw ConflictRequestError if category belongs to existing products', async () => {
      ;(productServices.checkProductByCategory as jest.Mock).mockResolvedValueOnce(true)

      await expect(categoryServices.deleteCategory(new ObjectId().toHexString())).rejects.toThrow(
        new ConflictRequestError({ message: CATEGORY_MESSAGES.CATEGORY_BELONG_TO_EXIST_PRODUCT })
      )
    })

    it('should delete category successfully', async () => {
      const mockId = new ObjectId().toHexString()
      ;(productServices.checkProductByCategory as jest.Mock).mockResolvedValueOnce(false)
      ;(databaseService.categories.findOne as jest.Mock).mockResolvedValueOnce({ _id: mockId })
      ;(databaseService.categories.deleteOne as jest.Mock).mockResolvedValueOnce({
        acknowledged: true,
        deletedCount: 1
      })
      ;(databaseService.informations.deleteOne as jest.Mock).mockResolvedValueOnce({
        acknowledged: true,
        deletedCount: 1
      })

      await expect(categoryServices.deleteCategory(mockId)).resolves.not.toThrow()
    })
  })
})
