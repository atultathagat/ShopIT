import React, { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/layout/loader";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import {
  useDeleteOrderMutation,
  useGetAdminOrdersQuery,
} from "../../redux/api/orderApi";
import AdminLayout from "../layout/AdminLayout";

export default function ListOrders() {
  const { data, isLoading, error, isError } = useGetAdminOrdersQuery();
  const [deleteOrder, {error: deleteOrderError, isSuccess}] = useDeleteOrderMutation();
  const handleOrderDelete = orderId => {
    deleteOrder(orderId);
  }
  const getOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "paymentStatus",
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
        paymentStatus: order?.paymentInfo?.status,
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <Link
              to={`/admin/orders/${order?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button className="btn btn-outline-danger ms-2" onClick={() => handleOrderDelete(order?._id)}>
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });
    return orders;
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
    if (deleteOrderError) {
      toast.error(deleteOrderError?.data?.message);
    }
    if (isSuccess) {
      toast.error('Order Deleted');
    }
  }, [error, deleteOrderError, isSuccess]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <AdminLayout>
      <MetaData title="All Products" />
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
    </AdminLayout>
  );
}
