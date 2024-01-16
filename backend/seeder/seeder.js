import mongoose from 'mongoose';
import productModel from '../models/productModel.js';
import products from './data.js';

const seedProducts = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/shopit-v2');
    await productModel.deleteMany();
    console.log('products are deleted');
    await productModel.insertMany(products);
    console.log('products are added');
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
