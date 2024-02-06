import express from 'express';
import {
  createProductReview,
  deleteProduct,
  deleteProductReview,
  getProductDetails,
  getProductReviews,
  getProducts,
  newProduct,
  updateProduct,
} from '../controllers/productControllers.js';
import isUserAuthenticated, { authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.route('/products').get(isUserAuthenticated, getProducts);
router.route('/admin/products').post(isUserAuthenticated, authorizeRoles(['admin']), newProduct);
router.route('/products/:id').get(getProductDetails);
router.route('/admin/products/:id').put(isUserAuthenticated, authorizeRoles(['admin']), updateProduct);
router.route('/admin/products/:id').delete(isUserAuthenticated, authorizeRoles(['admin']), deleteProduct);
router.route('/reviews').put(isUserAuthenticated, createProductReview).get(
  isUserAuthenticated,
  getProductReviews,
).delete(isUserAuthenticated, authorizeRoles(['admin']), deleteProductReview);

export default router;
