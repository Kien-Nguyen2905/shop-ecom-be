export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_REQUIRED: 'Name is required',
  NAME_STRING: 'Full name must be a string',
  NAME_LENGTH: 'Name length must be from 1 to 100',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Email is invalid',
  EMAIL_NOT_EXIST: 'Email not exist',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password is incorrect',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_STRING: 'Password must be a string',
  PASSWORD_LENGTH: 'Password length must be from 6 to 50',
  PASSWORD_STRONG:
    'Password must be 6 characters and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD__STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH: 'Confirm password length must be from 6 to 50',
  CONFIRM_PASSWORD_STRONG:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  TOKEN_EMAIL_VERIFY: 'Token email verify is required',
  EMAIL_VERIFIED: 'Email have been verified',
  REGISTER_SUCCEED: 'Register successfully',
  LOGIN_SUCCEED: 'Login successfully',
  LOGOUT_SUCCEED: 'Logout successfully',
  LOGOUT_UNSUCCEED: 'Logout unsuccessfully',
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_NOTFOUND: 'Refresh token not found',
  SEND_FORGOT_SUCCED: 'Send forgot password successfully',
  RESEND_FORGOT_SUCCED: 'Resend forgot password successfully',
  VERIFY_FORGOT_SUCCED: 'Verify forgot password token successfully',
  PASSWORD_TOKEN_REQUIRED: 'Password token is required',
  RESET_PASSWORD_SUCCED: 'Reset password successfully',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_STRING: 'Phone number must be a string',
  PHONE_INVALID: 'Phone number is invalid',
  PHONE_LENGTH: 'Phone number must be between 10 and 15 characters'
}

export const ADDRESS_MESSAGES = {
  PROVINCE_REQUIRED: 'Province is required',
  PROVINCE_STRING: 'Province must be a string',

  DISTRICT_REQUIRED: 'District is required',
  DISTRICT_STRING: 'District must be a string',

  WARD_REQUIRED: 'Ward is required',
  WARD_STRING: 'Ward must be a string',

  STREET_ADDRESS_REQUIRED: 'Street address is required',
  STREET_ADDRESS_STRING: 'Street address must be a string'
}

export const CATEGORY_MESSAGES = {
  CATEGORY_NAME_REQUIRED: 'Category name is required',
  CATEGORY_NAME_STRING: 'Category name must be a string',
  CATEGORY_NAME_EXISTS: 'Category name already exists',
  CATEGORY_NOT_EXISTS: 'Category does not exists',
  CATEGORY_BELONG_TO_EXIST_PRODUCT: 'Category belong to exist product',
  CATEGORY_ID_INVALID: 'Category id is invalid',
  CATEGORY_ID_MUST_BE_STRING: 'Category id must be string'
}

export const BRAND_MESSAGES = {
  BRAND_NAME_REQUIRED: 'Brand name is required',
  BRAND_NAME_STRING: 'Brand name must be a string',
  BRAND_NAME_EXISTS: 'Brand name already exists',
  BRAND_NOT_EXISTS: 'Brand does not exist',
  BRAND_BELONG_TO_EXIST_PRODUCT: 'Brand belong to exist product',
  BRAND_ID_INVALID: 'Brand id is invalid',
  BRAND_ID_REQUIRED: 'Brand id is required'
}

export const PRODUCT_MESSAGES = {
  PRODUCT_EXISTS: 'Product has already existed',
  PRODUCT_EXISTS_ORDER: 'Product has already existed order',
  PRODUCT_NOT_EXISTS: 'Product does not exist',
  PRODUCY_NAME_REQUIRED: 'Product name is required',
  PRODUCY_NAME_STRING: 'Product name must be string',
  PRODUCY_NAME_NAME_LENGTH: 'Product name length must be from 5 letters',

  PRODUCT_ID_REQUIRED: 'Product id is required',
  PRODUCT_ID_INVALID: 'Product id is invalid',
  PRODUCT_ID_MUST_BE_STRING: 'Product id must be string',

  THUMBNAIL_MUST_BE_STRING: 'Thumbnail must be a string',
  THUMBNAIL_NOT_EMPTY: 'Thumbnail cannot be empty',
  THUMBNAIL_INVALID_URL: 'Thumbnail must be a valid URL',

  DESCRIPTION_MUST_BE_STRING: 'Description must be a string',
  DESCRIPTION_NOT_EMPTY: 'Description cannot be empty',

  FEATURED_MUST_BE_OBJECT: 'Featured must be an object',
  FEATURED_IS_POPULAR_MUST_BE_BOOLEAN: 'isPopular must be a boolean',
  FEATURED_ON_SALE_MUST_BE_BOOLEAN: 'onSale must be a boolean',
  FEATURED_IS_RATED_MUST_BE_BOOLEAN: 'isRated must be a boolean',

  VARIANT_ID_REQUIRED: 'Variant id is required',
  VARIANT_ID_INVALID: 'Variant id is invalid',
  VARIANT_ID_MUST_BE_STRING: 'Variant id must be string',

  VARIANTS_MUST_BE_ARRAY: 'Variants must be an array',
  VARIANT_COLOR_MUST_BE_STRING: 'Variant color must be a string',
  VARIANT_PRICE_POSITIVE: 'Variant price must be a positive number',
  VARIANT_STOCK_POSITIVE_INTEGER: 'Variant stock must be a positive integer',

  VARIANT_STOCK_MINIMUM_STOCK: 'Variant stock must be large minimum stock',

  VARIANT_RATE_BETWEEN_0_AND_5: 'Variant rate must be an integer between 0 and 5',
  VARIANT_IMAGES_INVALID: 'Variant images must be with 3 images of valid URLs',
  VARIANT_DISCOUNT_BETWEEN_0_AND_1: 'Variant discount must be a number between 0 and 1',
  VARIANT_NOT_EXISTS: 'Variant does not exists',

  RATE_MUST_BE_INTEGER: 'Rate must be an integer between 0 and 5',

  STOCK_POSITIVE_INTEGER: 'Stock must be a positive integer',
  MINIMUM_STOCK: 'Minimum stock must be a positive integer',

  ATTRIBUTE_MUST_BE_OBJECT: 'Attribute must be an object',
  ATTRIBUTE_CPU_NON_EMPTY: 'CPU must be a non-empty string',
  ATTRIBUTE_RAM_NON_EMPTY: 'RAM must be a non-empty string',
  ATTRIBUTE_OS_NON_EMPTY: 'Operating system (os) must be a non-empty string',
  ATTRIBUTE_SCREEN_MUST_BE_NUMBER: 'Screen must be a number',
  ATTRIBUTE_WEIGHT_MUST_BE_INTEGER: 'Weight must be an integer',
  ATTRIBUTE_PIN_NON_EMPTY: 'Pin must be a non-empty string',
  ATTRIBUTE_DEMAND_ARRAY: 'Demand must be an array of non-empty strings'
}

export const WAREHOUSE_MESSAGES = {
  QUANTITY_MIN: 'Quantity must be a interger from 1',

  INVALID_IMPORT_QUANTITY: 'Import quantity must be a non-negative integer',

  STOCK_REQUIRED: 'Stock is required',
  INVALID_STOCK_VALUE: 'Stock must be a non-negative integer',

  INVALID_MINIMUM_STOCK_VALUE: 'Minimum stock must be a non-negative integer',

  SHIPMENTS_MUST_BE_ARRAY: 'Shipments must be an array',
  INVALID_SHIPMENT_ITEM: 'Each shipment must be a valid object',
  INVALID_SHIPMENT_QUANTITY: 'Shipment quantity must be a non-negative number.',
  INVALID_SHIPMENT_DATE: 'Shipment date must be a valid date string.'
}

export const CART_MESSAGES = {
  ITEM_ID_REQUIRED: 'Item id is required',
  ITEM_ID_MUST_BE_STRING: 'Item id must be string'
}

export const WISHLIST_MESSAGES = {
  ACTION_IS_REQUIRED: 'Action is required',
  ACTION_IS_INVALID: 'Action is invalid'
}
export const ORDER_MESSAGES = {
  PRODUCTS_ARRAY: 'Products must be array',
  ORDER_ID_REQUIRED: 'Order ID is required.',
  ORDER_NOT_FOUND: 'Order not found.',
  ORDER_STATUS_REQUIRED: 'Order status is required.',
  ORDER_STATUS_INVALID: 'Order status is invalid.',

  ORDER_NOTE_MUST_BE_STRING: 'Order note must be string',

  TYPE_PAYMENT_MUST_BE_INTEGER: 'Type payment must be an integer and either 0 or 1',

  EARN_POINT_MUST_BE_NUMBER: 'Earn point must be number',

  TRANSACTION_ID_MUST_BE_STRING: 'Transaction id must be string',
  TRANSACTION_ID_REQUIRED: 'Transaction id  is required',

  ODER_ID_MUST_BE_STRING: 'Oder id must be string',

  STATUS_MUST_BE_INTEGER: 'Status must be an integer and from 0 to 1'
}

export const REVIEW_MESSAGES = {
  TITLE_REQUIRED: 'Title is required',
  TITLE_MUST_BE_STRING: 'Title review must be string',
  RATE_MUST_BE_INTEGER: 'Status must be an integer and from 0 to 5'
}

export const POPULAR_MESSAGES = {
  QUANTITY_REQUIRED: 'Quantity is required',
  QUANTITY_MIN: 'Minimum quantity must be an interger and from 1',

  ID_REQUIRED: 'Id is required',
  ID_INVALID: 'Id is invalid',
  SUCCESS_MESSAGES: 'Successfully',
  ERROR_MESSAGES: 'Failed'
}

export const INFORMATION_MESSAGES = {
  BRAND_NAME_REQUIRED: 'Brand name is required.',
  INFORMATION_ID_STRING: 'Brand name must be a string.',
  BRAND_NAME_EXISTS: 'Brand name already exist.',
  BRAND_NOT_EXISTS: 'Brand does not exist.',
  BRAND_BELONG_TO_EXIST_PRODUCT: 'Brand belong to exist product',
  INFORMATION_ID_INVALID: 'Information id is invalid',
  INFORMATION_ID_REQUIRED: 'Information id is required'
}
