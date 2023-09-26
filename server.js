const path = require('path');
const express = require('express');
const cors = require('cors');
const compression = require('compression')
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/db');
// Routes
const mountRoutes = require('./routes');
const  {webhookCheckout}  = require('./services/orderServices');
// DB Connection
dbConnection();
//Express app
const app = express();

app.use(cors());
app.options('*', cors());

app.use(compression());

// webhook-checkout
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// MiddleWares
app.use(express.json());
app.use(express.static(path.join(__dirname, './uploads')));
// Mount Routes
mountRoutes(app);

// Error handling ways
// 1 - Create Err Send it to global err handler
// app.all('*',(req,res,next)=>{
//   const err = new Error(`Can't find this route : ${req.originalUrl}`)
//   next(err.message)
// })
// 2- Create CUustom and reusable err handling middleware
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400));
});
// Express Error Handling Middleware (Global) for express
app.use(globalError);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Mode : ${process.env.NODE_ENV}`);
}
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => console.log(`running on port : ${PORT}`));
//  Handling Errors (rejections) OutSide Express
process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection Errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.log('Shutting Down ...');
    process.exit(1);
  });
});
