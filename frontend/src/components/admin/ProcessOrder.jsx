import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/layout/loader";
import { MDBDataTable } from "mdbreact";
import { Link, useParams } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import {
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../redux/api/orderApi";

export default function ProcessOrder() {
  const params = useParams();
  const { data, isLoading } = useOrderDetailsQuery(params?.id);
  const [status, setStatus] = useState("");
  const [updateOrder, { error, isSuccess, isError }] = useUpdateOrderMutation();
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    orderStatus,
    _id,
    totalAmount,
    paymentMethod,
  } = data?.order || {};
  useEffect(() => {
    if (orderStatus) {
      setStatus(orderStatus);
    }
    if (isError) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Order updated");
    }
  }, [error, isSuccess]);
  useEffect(() => {
    if (orderStatus) {
      setStatus(orderStatus);
    }
  }, [orderStatus]);

  if (isLoading) {
    return <Loader />;
  }
  const updateOrderHandler = (id) => {
    updateOrder({ id, body: { status } });
  };

  return (
    <AdminLayout>
      <MetaData title={"Process Order"} />
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-8 order-details">
          <h3 className="mt-5 mb-4">Order Details</h3>

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
                <td
                  className={
                    paymentInfo?.status === "paid" ? "greenColor" : "redColor"
                  }
                >
                  <b>{paymentInfo?.status}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Method</th>
                <td>{paymentMethod}</td>
              </tr>
              <tr>
                <th scope="row">Stripe ID</th>
                <td>{paymentInfo?.id || "Nill"}</td>
              </tr>
              <tr>
                <th scope="row">Amount</th>
                <td>₹ {totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 my-4">Order Items:</h3>
          <hr />
          <div className="cart-item my-1">
            {orderItems.map((orderItem) => (
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
                  <Link to={`/product/${orderItem?.product}`}>
                    {orderItem?.name}
                  </Link>
                </div>

                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                  <p>₹ {orderItem?.price}</p>
                </div>

                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                  <p>{`${orderItem.quantity} Piece(s)`}</p>
                </div>
              </div>
            ))}
          </div>
          <hr />
        </div>

        <div className="col-12 col-lg-3 mt-5">
          <h4 className="my-4">Status</h4>

          <div className="mb-3">
            <select
              className="form-select"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <button
            className="btn btn-primary w-100"
            onClick={() => updateOrderHandler(params?.id)}
          >
            Update Status
          </button>

          <h4 className="mt-5 mb-3">Order Invoice</h4>
          <Link
              to={`/invoice/orders/${_id}`} className="btn btn-success w-100">
            <i className="fa fa-print"></i> Generate Invoice
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
