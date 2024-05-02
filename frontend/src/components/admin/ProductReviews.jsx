import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/layout/loader";
import { MDBDataTable } from "mdbreact";
import MetaData from "../../components/layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import { useDeleteReviewMutation, useLazyGetAdminReviewsQuery } from "../../redux/api/orderApi";

export default function ProductReviews() {
  const [productId, setProductId] = useState("");
  const [deleteReview, {error: deleteReviewError, isSuccess,  isLoading: deleteReviewLoading}] = useDeleteReviewMutation();
  const handleReviewDelete = id => {
    deleteReview({id, productId});
  }
  const [getAdminReviews, { data, isLoading, error }] =
    useLazyGetAdminReviewsQuery();
  const submitButtonHandler = (e) => {
    e.preventDefault();
    getAdminReviews(productId);
  };
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteReviewError) {
        toast.error(deleteReviewError?.data?.message);
      }
      if (isSuccess) {
        toast.error('Review Deleted');
      }
  }, [error, deleteReviewError, isSuccess]);
  if (isLoading) {
    return <Loader />;
  }

  const getReviews = () => {
    const reviews = {
      columns: [
        {
          label: "Review ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "ratings",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
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

    data?.reviews?.forEach((review) => {
      reviews.rows.push({
        id: review?._id,
        ratings: review?.ratings,
        comment: review?.comment,
        user: review?.user?.name,
        actions: (
          <>
            <button
              className="btn btn-outline-danger ms-2"
                onClick={() => handleReviewDelete(review?._id)}
                disabled={deleteReviewLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });
    return reviews;
  };
  return (
    <AdminLayout>
      {" "}
      <MetaData title={""} />
      <div className="row justify-content-center my-5">
        <div className="col-6">
          <form onSubmit={submitButtonHandler}>
            <div className="mb-3">
              <label for="productId_field" className="form-label">
                Enter Product ID
              </label>
              <input
                type="text"
                id="productId_field"
                className="form-control"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <button
              id="search_button"
              type="submit"
              className="btn btn-primary w-100 py-2"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>
      {!!data?.reviews?.length ? (
        <MDBDataTable
          className="px-3"
          striped
          bordered
          hover
          data={getReviews()}
        />
      ) : (
        <p className="mt-5 text-center">No Reviews</p>
      )}
    </AdminLayout>
  );
}
