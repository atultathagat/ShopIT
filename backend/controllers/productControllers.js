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
    resPerPage: (+req?.query?.resPerPage)
  });
});

// Create new product => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
  req.body.user = req.user._id;
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
    new: true
  });
  return res.status(200).json({ product });
});

// Delete product => /api/v1/admin/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  await product.deleteOne();
  return res.status(200).json({ message: 'Product deleted' });
});

// Create/update product review => /api/v1/reveiws
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { ratings, comment, productId } = req?.body;
  const review = {
    user: req?.user?._id,
    ratings: Number(ratings),
    comment
  };
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  const existingReview = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (existingReview) {
    existingReview.ratings = Number(ratings);
    existingReview.comment = comment;
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  product.ratings = (product.reviews.reduce((acc, r) => acc + r.ratings, 0)) / product.numOfReviews;
  await product.save({ validateBeforeSave: false });
  return res.status(200).json({ success: true });
});

// Get product review => /api/v1/reveiws
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req?.query?.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  return res.status(200).json({ reviews: product.reviews });
});

// Delete product review => /api/v1/reveiws
export const deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  let product = await productModel.findById(req?.query?.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  const reviews = product.reviews.filter(r => r.user.toString() !== req?.query?.user);
  const numOfReviews = reviews.length;
  const ratings = numOfReviews === 0 ? 0 : (product.reviews.reduce((acc, r) => acc + r.ratings, 0)) / product.numOfReviews;
  product = await productModel.findByIdAndUpdate(req?.query?.id, { reviews, numOfReviews, ratings }, { new: true });
  return res.status(200).json({ product, success: true });
});
