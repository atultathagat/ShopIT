import productModel from '../models/productModel.js';

// Get products list => /api/v1/products
export const getProducts = async (__, res) => {
  const products = await productModel.find();
  res.status(200).json({
    products,
  });
};

// Create new product => /api/v1/admin/products
export const newProduct = async (req, res) => {
  const product = await productModel.create(req.body);
  res.status(200).json({ product });
};

// Get single product details => /api/v1/admin/products/:id
export const getProductDetails = async (req, res) => {
  const product = await productModel.findById(req?.params?.id);
  if (!product) {
    return res.status(404).json({
      error: 'Product not found',
    });
  }
  return res.status(200).json({ product });
};

// Update product details => /api/v1/admin/products/:id
export const updateProduct = async (req, res) => {
  let product = await productModel.findById(req?.params?.id);
  if (!product) {
    return res.status(404).json({
      error: 'Product not found',
    });
  }
  product = await productModel
    .findByIdAndUpdate(req?.params?.id, req?.body, { new: true });
  return res.status(200).json({ product });
};

// Delete product => /api/v1/admin/products/:id
export const deleteProduct = async (req, res) => {
  const product = await productModel.findById(req?.params?.id);
  if (!product) {
    return res.status(404).json({
      error: 'Product not found',
    });
  }
  await product.deleteOne();
  return res.status(200).json({ message: 'Product deleted' });
};
