import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// Import all the routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { connectDataBase } from './config/dbConnection.js';
import errorMiddleware from './middlewares/error.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
dotenv.config({ path: 'config/config.env' });

// Handle uncaught exception
process.on('uncaughtException', err => {
  console.log(`ERROR: ${err}`);
  console.log('Shuttting down due to uncaught exception');
  process.exit(1);
});

connectDataBase();
app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', orderRoutes);
app.use(errorMiddleware);
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${
      process.env.NODE_ENV} mode.`
  );
});

// Handle unhandle promise rejection
process.on('unhandledRejection', err => {
  console.log(`ERROR: ${err}`);
  console.log('Shuttting down the server due to unahndled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});
