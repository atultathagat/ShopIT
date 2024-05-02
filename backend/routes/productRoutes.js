import express from 'express';
import {
  canUserReview,
  createProductReview,
  deleteProduct,
  deleteProductImage,
  deleteProductReview,
  getAdminProducts,
  getProductDetails,
  getProductReviews,
  getProducts,
  newProduct,
  updateProduct,
  uploadProductImages
} from '../controllers/productControllers.js';
import isUserAuthenticated, { authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();
router.route('/products').get(getProducts);
router.route('/admin/products').post(isUserAuthenticated, authorizeRoles(['admin']), newProduct);
router.route('/products/:id').get(getProductDetails);
router.route('/admin/products/:id').put(isUserAuthenticated, authorizeRoles(['admin']), updateProduct);
router.route('/admin/products/:id').delete(isUserAuthenticated, authorizeRoles(['admin']), deleteProduct);
router.route('/reviews').put(isUserAuthenticated, createProductReview).get(
  isUserAuthenticated,
  getProductReviews
).delete(isUserAuthenticated, authorizeRoles(['admin']), deleteProductReview);
router.route('/can_review').get(isUserAuthenticated, canUserReview)
router.route('/admin/products/').get(isUserAuthenticated, authorizeRoles(['admin']), getAdminProducts);
router.route('/admin/products/:id/upload_images').put(isUserAuthenticated, authorizeRoles(['admin']), uploadProductImages);
router.route('/admin/products/:id/delete_image').put(isUserAuthenticated, authorizeRoles(['admin']), deleteProductImage);

export default router;
