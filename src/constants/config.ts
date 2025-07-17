import { config } from 'dotenv'

const envName = process.env.NODE_ENV
export const isProduction = envName === 'production'

config({
  path: isProduction ? '.env.production' : '.env'
})

export const env = {
  CORS_ORIGIN: process.env.CORS_ORIGIN as string,
  PORT: process.env.PORT as string,
  HOST: process.env.HOST as string,
  DB_CONNECT: process.env.CONNECT_STRING_MG as string,
  DB_NAME: process.env.DB_NAME as string,
  API_VERSION: process.env.API_VERSION as string,
  PASSWORD_MAIL: process.env.PASSWORD_MAIL_APP as string,
  PASSWORD_SECRET: process.env.PASSWORD_SECRET as string,
  JWT_SECRET_ACCESS_TOKEN: process.env.PASSWORD_SECRET as string,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  JWT_SECRET_REFRESH_TOKEN: process.env.PASSWORD_SECRET as string,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  JWT_SECRET_EMAIL_VERIFY_TOKEN: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  EMAIL_VERIFY_TOKEN_EXPIRES_IN: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
  JWT_SECRET_FORGOT_PASSWORD_TOKEN: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
  FORGOT_PASSWORD_TOKEN_EXPIRES_IN: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string,
  USERS_COLLECTION: process.env.DB_USERS_COLLECTION as string,
  TOKENS_COLLECTION: process.env.DB_TOKENS_COLLECTION as string,
  VERIFICATIONS_COLLECTION: process.env.DB_VERIFICATIONS_COLLECTION as string,
  PASSWORD_RESETS_COLLECTION: process.env.DB_PASSWORD_RESETS_COLLECTION as string,
  PROVINCE_COLLECTION: process.env.DB_PROVINCE_COLLECTION as string,
  DISTRICT_COLLECTION: process.env.DB_DISTRICT_COLLECTION as string,
  WARD_COLLECTION: process.env.DB_WARD_COLLECTION as string,
  CATEGORY_COLLECTION: process.env.DB_CATEGORY_COLLECTION as string,
  BRAND_COLLECTION: process.env.DB_BRAND_COLLECTION as string,
  PRODUCT_COLLECTION: process.env.DB_PRODUCT_COLLECTION as string,
  INFORMATION_COLLECTION: process.env.DB_INFORMATION_COLLECTION as string,
  WAREHOUSE_COLLECTION: process.env.DB_WAREHOUSE_COLLECTION as string,
  CART_COLLECTION: process.env.DB_CART_COLLECTION as string,
  WISHLIST_COLLECTION: process.env.DB_WISHLIST_COLLECTION as string,
  ORDER_COLLECTION: process.env.DB_ORDER_COLLECTION as string,
  TRANSACTION_COLLECTION: process.env.DB_TRANSACTION_COLLECTION as string,
  REVIEW_COLLECTION: process.env.DB_REVIEW_COLLECTION as string,
  SEPAY_API_KEY: process.env.SEPAY_API_KEY as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI as string,
  CLIENT_REDIRECT: process.env.CLIENT_REDIRECT_CALLBACK as string,
  CLIENT_URL: process.env.CLIENT_URL as string,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  AWS_REGION: process.env.AWS_REGION as string,
  SES_FROM_ADDRESS: process.env.SES_FROM_ADDRESS as string
}
