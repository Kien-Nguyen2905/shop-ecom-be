import express from 'express'
import cors, { CorsOptions } from 'cors'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import addressRoute from '~/routes/address.routes'
import brandRoute from '~/routes/brands.routes'
import cartRoute from '~/routes/carts.routes'
import categoryRoute from '~/routes/categories.routes'
import imagesRoute from '~/routes/images.routes'
import orderRoute from '~/routes/orders.routes'
import productRoute from '~/routes/products.routes'
import staticRoute from '~/routes/static.routes'
import userRoute from '~/routes/users.routes'
import warehouseRoute from '~/routes/warehouse.routes'
import wishlistRoute from '~/routes/wishlists.routes'
import databaseService from '~/services/database/database.services'
import { initFolder } from '~/utils/file'
import transactionRoute from '~/routes/transactions.routes'
import reviewRoute from '~/routes/reviews.routes'
import informationRoute from '~/routes/information.routes'
import { env } from '~/constants/config'
import helmet from 'helmet'

const app = express()

const port = env.PORT || 8080
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
)

app.use(
  cors({
    origin: '*'
  })
)

databaseService.connect()
app.use(express.json())
initFolder()

app.use(`${env.API_VERSION}/users`, userRoute)
app.use(`${env.API_VERSION}/address`, addressRoute)
app.use(`${env.API_VERSION}/category`, categoryRoute)
app.use(`${env.API_VERSION}/brand`, brandRoute)
app.use(`${env.API_VERSION}/product`, productRoute)
app.use(`${env.API_VERSION}/warehouse`, warehouseRoute)
app.use(`${env.API_VERSION}/cart`, cartRoute)
app.use(`${env.API_VERSION}/wishlist`, wishlistRoute)
app.use(`${env.API_VERSION}/images`, imagesRoute)
app.use(`${env.API_VERSION}/static`, staticRoute)
app.use(`${env.API_VERSION}/order`, orderRoute)
app.use(`${env.API_VERSION}/transaction`, transactionRoute)
app.use(`${env.API_VERSION}/review`, reviewRoute)
app.use(`${env.API_VERSION}/information`, informationRoute)

app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
