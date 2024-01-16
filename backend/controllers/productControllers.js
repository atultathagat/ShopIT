import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import productModel from '../models/productModel.js';
import ApiFilters from '../utils/apiFilters.js';
import ErrorHandler from '../utils/errorHandler.js';

// Get products list => /api/v1/products
export const getProducts = catchAsyncErrors(async (req, res) => {
  const apiFilters = new ApiFilters(productModel, req.query);
  apiFilters.search().find();
  let products = await apiFilters.query;
  const filterProductsCount = products.length;
  apiFilters.pagination(req.query);
  products = await apiFilters.query.clone();
  res.status(200).json({
    filterProductsCount,
    products,
  });
});

// Create new product => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
  const product = await productModel.create(req.body);
  res.status(200).json({ product });
});

// Get single product details => /api/v1/admin/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  return res.status(200).json({ product });
});

// Update product details => /api/v1/admin/products/:id
export const updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await productModel.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  product = await productModel.findByIdAndUpdate(req?.params?.id, req?.body, {
    new: true,
  });
  return res.status(200).json({ product });
});

// Delete product => /api/v1/admin/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res) => {
  const product = await productModel.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  await product.deleteOne();
  return res.status(200).json({ message: 'Product deleted' });
});
