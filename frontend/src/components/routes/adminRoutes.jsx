import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute.jsx";
import Dashboard from "../admin/Dashboard.jsx";
import ListProducts from "../admin/ListProducts.jsx";
import NewProduct from "../admin/NewProduct.jsx";
import UpdateProduct from "../admin/UpdateProduct.jsx";
import UploadImages from "../admin/UploadImages.jsx";
import ListOrders from "../admin/ListOrders.jsx";
import ProcessOrder from "../admin/ProcessOrder.jsx";
import ListUsers from "../admin/ListUsers.jsx";
import UpdateUser from "../admin/UpdateUser.jsx";
import ProductReviews from "../admin/ProductReviews.jsx";

export default function AdminRoutes() {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute admin>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute admin>
            <ListProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/product/new"
        element={
          <ProtectedRoute admin>
            <NewProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id"
        element={
          <ProtectedRoute admin>
            <UpdateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id/upload_image"
        element={
          <ProtectedRoute admin>
            <UploadImages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute admin>
            <ListOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute admin>
            <ProcessOrder />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users/"
        element={
          <ProtectedRoute admin>
            <ListUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute admin>
            <UpdateUser />
          </ProtectedRoute>
        }
      />

<Route
        path="/admin/reviews"
        element={
          <ProtectedRoute admin>
            <ProductReviews/>
          </ProtectedRoute>
        }
      />
    </>
  );
}
