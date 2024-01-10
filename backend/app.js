import dotenv from 'dotenv';
import express from 'express';
// Import all the routes
import productRoutes from './routes/productRoutes.js';
import { connectDataBase } from './config/dbConnection.js';

const app = express();
app.use(express.json());
dotenv.config({ path: 'backend/config/config.env' });
connectDataBase();
app.use('/api/v1', productRoutes);
app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${
      process.env.NODE_ENV} mode.`,
  );
});
