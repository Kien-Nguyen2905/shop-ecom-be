import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/users/users.schemas'
import Token from '~/models/schemas/tokens/tokens.schemas'
import Verification from '~/models/schemas/verifications/verifications.schemas'
import PasswordReset from '~/models/schemas/password-resets/password-resets.schemas'
import Province from '~/models/schemas/provinces/provinces.schemas'
import District from '~/models/schemas/districts/districts.schemas'
import Ward from '~/models/schemas/wards/wards.schemas'
import Category from '~/models/schemas/categories/categories.schemas'
import Brand from '~/models/schemas/brands/brands.schemas'
import Product from '~/models/schemas/products/products.schemas'
import Information from '~/models/schemas/informations/informations.schemas'
import Warehouse from '~/models/schemas/warehouse/warehouse.schemas'
import Cart from '~/models/schemas/carts/carts.schemas'
import Wishlist from '~/models/schemas/wishlists/wishlists.schemas'
import Order from '~/models/schemas/orders/orders.schemas'
import Transaction from '~/models/schemas/transactions/transactions.schemas'
import Review from '~/models/schemas/reviews/reviews.schemas'
import { env } from '~/constants/config'
config()

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(env.DB_CONNECT as string)
    this.db = this.client.db(env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(env.USERS_COLLECTION as string)
  }
  get verifications(): Collection<Verification> {
    return this.db.collection(env.VERIFICATIONS_COLLECTION as string)
  }
  get passwordResets(): Collection<PasswordReset> {
    return this.db.collection(env.PASSWORD_RESETS_COLLECTION as string)
  }
  get tokens(): Collection<Token> {
    return this.db.collection(env.TOKENS_COLLECTION as string)
  }
  get provinces(): Collection<Province> {
    return this.db.collection(env.PROVINCE_COLLECTION as string)
  }
  get districts(): Collection<District> {
    return this.db.collection(env.DISTRICT_COLLECTION as string)
  }
  get wards(): Collection<Ward> {
    return this.db.collection(env.WARD_COLLECTION as string)
  }
  get categories(): Collection<Category> {
    return this.db.collection(env.CATEGORY_COLLECTION as string)
  }
  get brands(): Collection<Brand> {
    return this.db.collection(env.BRAND_COLLECTION as string)
  }
  get products(): Collection<Product> {
    return this.db.collection(env.PRODUCT_COLLECTION as string)
  }
  get informations(): Collection<Information> {
    return this.db.collection(env.INFORMATION_COLLECTION as string)
  }
  get warehouse(): Collection<Warehouse> {
    return this.db.collection(env.WAREHOUSE_COLLECTION as string)
  }
  get carts(): Collection<Cart> {
    return this.db.collection(env.CART_COLLECTION as string)
  }
  get wishlist(): Collection<Wishlist> {
    return this.db.collection(env.WISHLIST_COLLECTION as string)
  }
  get orders(): Collection<Order> {
    return this.db.collection(env.ORDER_COLLECTION as string)
  }
  get transactions(): Collection<Transaction> {
    return this.db.collection(env.TRANSACTION_COLLECTION as string)
  }
  get reviews(): Collection<Review> {
    return this.db.collection(env.REVIEW_COLLECTION as string)
  }
  // Phương thức để lấy collection động dựa trên tên, với ràng buộc `T extends Document`
  getCollection<T extends Document>(collectionName: string): Collection<T> {
    return this.db.collection<T>(collectionName)
  }
}

const databaseService = new DatabaseService()
export default databaseService
