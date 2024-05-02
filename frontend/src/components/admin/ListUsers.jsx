import React, { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/layout/loader";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import MetaData from "../../components/layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import {
  useDeleteUserMutation,
  useGetAdminUsersQuery,
} from "../../redux/api/userAPI";

export default function ListUsers() {
  const { data, isLoading, error, isError } = useGetAdminUsersQuery();
  const [
    deleteUser,
    { error: deleteUserError, isSuccess, isLoading: deleteUserLoading },
  ] = useDeleteUserMutation();
  const handleUserDelete = (userId) => {
    deleteUser(userId);
  };
  const getUsers = () => {
    const users = {
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
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
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

    data?.users?.forEach((user) => {
      users.rows.push({
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        actions: (
          <>
            <Link
              to={`/admin/users/${user?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              className="btn btn-outline-danger ms-2"
              onClick={() => handleUserDelete(user?._id)}
              disabled={deleteUserLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });
    return users;
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
    if (deleteUserError) {
      toast.error(deleteUserError?.data?.message);
    }
    if (isSuccess) {
      toast.error("User Deleted");
    }
  }, [error, deleteUserError, isSuccess]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <AdminLayout>
      <MetaData title="All Products" />
      <div>
        <h1 className="my-5">{data?.users?.length} users</h1>
        <MDBDataTable
          className="px-3"
          striped
          bordered
          hover
          data={getUsers()}
        />
      </div>
    </AdminLayout>
  );
}
