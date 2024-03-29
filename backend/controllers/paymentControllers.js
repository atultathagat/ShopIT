import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create stripe checkout session => /api/v1/payment/checkout_session
export const stripeCheckoutSession = catchAsyncErrors(
  async (req, res, next) => {
    const body = req?.body;
    const line_items = body?.orderItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item?.name,
          images: [item?.image],
          metadata: { productId: item?.product },
        },
        unit_amount: item?.price*100,
      },
      tax_rates: ["txr_1Oyfa5SDRzj09xVXABorsdz6"],
      quantity: item?.quantity,
    }));
    const shippingInfo = body.shippingInfo;
    const shipping_rate =
      body.itemsPrice >= 200
        ? "shr_1OzdZLSDRzj09xVXi8c9D4HP"
        : "shr_1OzdY6SDRzj09xVXKfocHBMq";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/me/orders`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      customer_email: `${req.user.email.toString()}`,
      client_reference_id: req?.user?._id?.toString(),
      mode: "payment",
      shipping_options: [{ shipping_rate }],
      line_items,
      metadata: { ...shippingInfo, itemsPrice: body.itemsPrice },
    });
    return res.status(200).json({
      url: session.url,
    });
  }
);

const getOrderItems =async (lineItems) => {
  return new Promise((resolve, reject) => {
    let cartItems = [];
     lineItems?.data?.forEach(async (item) => {
      console.log(item);
      const product = await stripe.products.retrieve(item.price.product)
       const productId = product.metadata.productId
      cartItems.push({
        product: productId,
        name: product.name,
        price: item.price.unit_amount_decimal/100,
        quantity: item.quantity,
        image: product.images[0]
      })
      if(cartItems.length === lineItems.data.length) {
        resolve(cartItems)
      }
    })
  })
}

// Create new order after payment => /api/v1/payment/webhook
export const stripeWebHook = catchAsyncErrors(async (req, res, next) => {
  try {
    const signature = req?.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log(session);
      const line_items = await stripe.checkout.sessions.listLineItems(session.id);
      console.log(line_items);
      const orderItems = await getOrderItems(line_items);
      const user = session.client_reference_id;
      const totalAmount = session.amount_total / 100;
      const taxAmount = session.total_details.amount_tax / 100;
      const shippingAmount = session.total_details.amount_shipping / 100;
      const itemsPrice = session.metadata.itemsPrice;
      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
        phoneNo: session.metadata.phoneNo,
        zipCode: session.metadata.zipCode,
        country: session.metadata.country,
      };
      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };
      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod: "Card",
        user,
      };
      await orderModel.create(orderData);
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log(error);
  }
});
