import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useOrderDetailsQuery } from "../redux/api/orderApi";
import Loader from "../components/layout/loader";
import MetaData from "../components/layout/MetaData";
import toast from "react-hot-toast";

export default function OrderDetails() {
  const params = useParams();
  const { data, isLoading, error, isError } = useOrderDetailsQuery(params?.id);
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [error]);
  if (isLoading) {
    return <Loader />;
  }
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
    _id,
    createdAt,
    totalAmount,
    paymentMethod
  } = data.order;
  return (
    <>
      <MetaData title="Order Details" />
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-lg-9 mt-5 order-details">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mt-5 mb-4">Your Order Details</h3>
            <a className="btn btn-success" href="/invoice/order/order-id">
              <i className="fa fa-print"></i> Invoice
            </a>
          </div>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">ID</th>
                <td>{_id}</td>
              </tr>
              <tr>
                <th scope="row">Status</th>
                <td
                  className={
                    orderStatus.includes("Delivered")
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  <b>{orderStatus}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Date</th>
                <td>{new Date(createdAt).toLocaleString("en-US")}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Shipping Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{user?.name}</td>
              </tr>
              <tr>
                <th scope="row">Phone No</th>
                <td>{shippingInfo?.phoneNo}</td>
              </tr>
              <tr>
                <th scope="row">Address</th>
                <td>
                {shippingInfo?.address}, {shippingInfo?.city},{" "}
            {shippingInfo?.zipcode}, {shippingInfo?.country}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Payment Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Status</th>
                <td className={paymentInfo?.status === "paid" ? "greenColor" : "redColor"}>
                  <b>{paymentInfo?.status}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Method</th>
                <td>{paymentMethod}</td>
              </tr>
              <tr>
                <th scope="row">Stripe ID</th>
                <td>{paymentInfo?.id || 'Nill'}</td>
              </tr>
              <tr>
                <th scope="row">Amount Paid</th>
                <td>₹ {totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 my-4">Order Items:</h3>

          <hr />
          <div className="cart-item my-1">
            {
                orderItems.map(orderItem => (
                    <div className="row my-5">
                    <div className="col-4 col-lg-2">
                      <img
                        src={orderItem?.image}
                        alt={orderItem?.name}
                        height="45"
                        width="65"
                      />
                    </div>
      
                    <div className="col-5 col-lg-5">
                      <Link to={`/product/${orderItem?.product}`}>{orderItem?.name}</Link>
                    </div>
      
                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                      <p>₹ {orderItem?.price}</p>
                    </div>
      
                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                      <p>{`${orderItem.quantity} Piece(s)`}</p>
                    </div>
                  </div>
                ))
            }
          </div>
          <hr />
        </div>
      </div>
    </>
  );
}
