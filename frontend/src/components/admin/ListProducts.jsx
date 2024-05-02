import React, { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/layout/loader";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import { useDeleteProductMutation, useGetAdminProductsQuery } from "../../redux/api/productApi";
import AdminLayout from "../layout/AdminLayout";

export default function ListProducts() {
  const { data, isLoading, error, isError } = useGetAdminProductsQuery();
  const [deleteProduct, {isLoading: deleteProductLoading, error: deleteProductError, isSuccess}] = useDeleteProductMutation();
  const getProducts = () => {
    const products = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
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
  const deleteProductHandler = id => {
    deleteProduct(id)
  }
    data?.products?.forEach((product) => {
      products.rows.push({
        id: product?._id,
        name: `${product?.name?.substring(0, 20)}...`,
        stock: product?.stock,
        actions: (
          <>
            <Link to={`/admin/products/${product?._id}`} className="btn btn-outline-primary">
              <i className="fa fa-pencil"></i>
            </Link>
            <Link to={`/admin/products/${product?._id}/upload_image`} className="btn btn-outline-success ms-2">
              <i className="fa fa-image"></i>
            </Link>
            <button className="btn btn-outline-danger ms-2"
            disabled={deleteProductLoading}
            onClick={() => deleteProductHandler(product?._id) }
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });
    return products;
  };
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    } if (deleteProductError) {
      toast.error(deleteProductError?.data?.message);
    } if (isSuccess) {
      toast.success('Product Deleted');
    }
  }, [error, deleteProductError, isSuccess]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <AdminLayout>
      <MetaData title="All Products" />
      <div>
        <h1 className="my-5">{data?.products?.length} orders</h1>
        <MDBDataTable
          className="px-3"
          striped
          bordered
          hover
          data={getProducts()}
        />
      </div>
    </AdminLayout>
  );
}
