const categoryRoute = require('./categoryRoute');
const subCategoryRoute = require('./subCategoryRoute');
const brandRoute = require('./brandRoute');
const productRoute = require('./productRoute');
const reviewRoute = require('./reviewRoute');
const wishListRoute = require('./wishListRoute');
const addressesRoute = require('./addressesRoute');
const couponRoute = require('./couponRoute');
const cartRoute = require('./cartRoute');
const orderRoute = require('./orderRoute');
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');

const mountRoutes = (app) => {
  app.use('/api/categories', categoryRoute);
  app.use('/api/subcategories', subCategoryRoute);
  app.use('/api/brands', brandRoute);
  app.use('/api/products', productRoute);
  app.use('/api/reviews', reviewRoute);
  app.use('/api/wishlist', wishListRoute);
  app.use('/api/addresses', addressesRoute);
  app.use('/api/coupons', couponRoute);
  app.use('/api/cart', cartRoute);
  app.use('/api/orders', orderRoute);
  app.use('/api/users', userRoute);
  app.use('/api/auth', authRoute);
};

module.exports = mountRoutes;
