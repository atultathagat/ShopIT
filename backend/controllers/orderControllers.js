import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import ErrorHandler from '../utils/errorHandler.js';

// Create new order : /api/v1/orders/new
export default catchAsyncErrors(async (req, res) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo
  } = req?.body;
  const order = await orderModel.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
    paymentMethod,
    paymentInfo,
    user: req?.user?._id
  });
  res.status(200).json({ order });
});

// Get order details : /api/v1/order/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel.findById(req?.params?.id).populate('user', 'name email');
  if (!order) {
    return next(new ErrorHandler(`No order found with the given order id: ${req?.params?.id}`, 404));
  }
  return res.status(200).json({ order });
});

// Get current user orders : /api/v1/me/orders
export const myOrders = catchAsyncErrors(async (req, res) => {
  const orders = await orderModel.find({ user: req?.user?._id });
  return res.status(200).json({ orders });
});

// Get all orders (ADMIN) : /api/v1/admin/orders
export const allOrders = catchAsyncErrors(async (req, res) => {
  const orders = await orderModel.find();
  return res.status(200).json({ orders });
});

// Update order (ADMIN) : /api/v1/admin/order/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel.findById(req?.params?.id);
  if (!order) {
    return next(new ErrorHandler(`No order found with the given order id: ${req?.params?.id}`, 404));
  }
  if (order?.orderStatus === 'Delivered') {
    return next(new ErrorHandler('You have already delivered this order', 400));
  }
  order?.orderItems.forEach(async orderItem => {
    const product = await productModel.findById(orderItem?.product);
    if (!product) {
      return next(new ErrorHandler(`No order found with the given order id: ${orderItem?.product.toString()}`, 404));
    }
    product.stock -= orderItem.quantity;
    await product.save({ validateBeforeSave: false });
  });
  order.orderStatus = req?.body?.status;
  order.deliveredAt = Date.now();
  await order.save();
  return res.status(200).json({ success: true });
});

// Delete order (ADMIN) : /api/v1/admin/order/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel.findById(req?.params?.id).populate('user', 'name email');
  if (!order) {
    return next(new ErrorHandler(`No order found with the given order id: ${req?.params?.id}`, 404));
  }
  await order.deleteOne();
  return res.status(200).json({ success: true });
});
