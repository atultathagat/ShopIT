import express from 'express';
import createNewOrder, { allOrders, deleteOrder, getOrderDetails, getSales, myOrders, updateOrder } from '../controllers/orderControllers.js';
import isUserAuthenticated, { authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.route('/orders/new').post(isUserAuthenticated, createNewOrder);
router.route('/orders/:id').get(isUserAuthenticated, getOrderDetails);
router.route('/me/orders').get(isUserAuthenticated, myOrders);
router.route('/admin/orders').get(isUserAuthenticated, authorizeRoles(['admin']), allOrders);
router.route('/admin/orders/:id').put(isUserAuthenticated, authorizeRoles(['admin']), updateOrder);
router.route('/admin/orders/:id').delete(isUserAuthenticated, authorizeRoles(['admin']), deleteOrder);
router.route('/admin/get_sales').get(isUserAuthenticated, authorizeRoles(['admin']), getSales);

export default router;
