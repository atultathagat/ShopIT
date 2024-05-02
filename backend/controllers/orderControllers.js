import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";

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
    paymentInfo,
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
    user: req?.user?._id,
  });
  res.status(200).json({ order });
});

// Get order details : /api/v1/order/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel
    .findById(req?.params?.id)
    .populate("user", "name email");
  if (!order) {
    return next(
      new ErrorHandler(
        `No order found with the given order id: ${req?.params?.id}`,
        404
      )
    );
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
    return next(
      new ErrorHandler(
        `No order found with the given order id: ${req?.params?.id}`,
        404
      )
    );
  }
  if (order?.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }
  let productNotFound = false;
  for(const item of order?.orderItems) {
    const product = await productModel.findById(item?.product);
    if (!product) {
      productNotFound = true;
      break;
    }
    product.stock -= item.quantity;
    await product.save({validateBeforeSave: false});
  
  }
  if(productNotFound) {
    return next(
      new ErrorHandler(
        `No order found with the one or more IDs.`,
        404
      )
    );
  }
  order.orderStatus = req?.body?.status;
  if(req?.body?.status === 'Delivered') {
  order.deliveredAt = Date.now();
  order.paymentInfo.status = 'paid';
  }
  await order.save({validateBeforeSave: false});
  return res.status(200).json({ success: true });
});

// Delete order (ADMIN) : /api/v1/admin/order/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel
    .findById(req?.params?.id)
    .populate("user", "name email");
  if (!order) {
    return next(
      new ErrorHandler(
        `No order found with the given order id: ${req?.params?.id}`,
        404
      )
    );
  }
  await order.deleteOne();
  return res.status(200).json({ success: true });
});

const getDaysBetween = (startDate, endDate) => {
const dates = [];
let currentDate = new Date(startDate);
while(currentDate <= new Date(endDate)) {
  dates.push(currentDate.toISOString().split('T')[0])
  currentDate.setDate(currentDate.getDate() + 1);
}
return dates;
};

const getSalesData = async (startDate, endDate) => {
  const orders = await orderModel.aggregate([
    {
      $match: {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }
    },
      {
        $group: {
        _id: { date: {$dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } },
        totalSales: { $sum: "$totalAmount" },
        numOfOrder: { $sum: 1 }
      },
    },
  ]);
  const salesMap = new Map();
  const totalSales = orders.reduce((sum, order) => sum + order?.totalSales, 0);
  const totalNumberOfOrders = orders.reduce((sum, order) => sum + order?.numOfOrder, 0);
  orders.forEach(order => {
    salesMap.set(order?._id?.date, {totalSales: order?.totalSales, numOfOrders: order?.numOfOrder})
  })
const datesBetween = getDaysBetween(startDate, endDate);
const finalSalesData = datesBetween.map(date => ({
date,
sales: salesMap.get(date)?.totalSales??0,
numOfOrders: salesMap.get(date)?.numOfOrders??0
}))
return {
  salesData: finalSalesData,
  totalSales,
  totalNumberOfOrders
}
};
// Get sales data => /api/v1/admin/get_sales
export const getSales = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req?.query?.startDate);
  const endDate = new Date(req?.query?.endDate);
  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);
  const salesData = await getSalesData(startDate, endDate);
  res.status(200).json({...salesData});
});
