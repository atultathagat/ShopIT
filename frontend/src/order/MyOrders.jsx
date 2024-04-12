import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useMyOrdersQuery } from "../redux/api/orderApi";
import Loader from "../components/layout/loader";
import { MDBDataTable } from "mdbreact";
import { Link, useSearchParams } from "react-router-dom";
import MetaData from "../components/layout/MetaData";
import { clearCartItems } from '../redux/filters/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

export default function MyOrders() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const orderSuccess = searchParams.get('order_success')
  const { data, isLoading, error, isError } = useMyOrdersQuery();
  const getOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Amount Paid",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Order Status",
          field: "orderStatus",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };
    data?.orders?.forEach((order) => {
      orders.rows.push({
        id: order?._id,
        amount: `₹${order?.totalAmount}`,
        status: order?.paymentInfo.status?.toUpperCase(),
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <Link to={`/me/orders/${order?._id}`} className="btn btn-primary">
              <i className="fa fa-eye"></i>
            </Link>
            <Link
              to={`/invoice/orders/${order?._id}`}
              className="btn btn-success ms-2"
            >
              <i className="fa fa-print"></i>
            </Link>
          </>
        ),
      });
    });
    return orders;
  };
  useEffect(() => {
    if(orderSuccess) {
      dispatch(clearCartItems())
      navigate('/me/orders')
    }
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [error, orderSuccess]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <MetaData title="My Orders" />
      <div>
        <h1 className="my-5">{data?.orders?.length} orders</h1>
        <MDBDataTable
          className="px-3"
          striped
          bordered
          hover
          data={getOrders()}
        />
      </div>
    </>
  );
}
