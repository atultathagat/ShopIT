import express from 'express';
import {
  deleteProduct,
  getProductDetails,
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

export default router;
