import React, { useEffect, useState } from 'react'
import AdminLayout from '../layout/AdminLayout'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../redux/api/userAPI';
import toast from 'react-hot-toast';

export default function UpdateUser() {
  const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const params = useParams();
    const {data} = useGetUserDetailsQuery(params?.id);
    const [updateUser, {isLoading, isError, isSuccess, error}] = useUpdateUserMutation();
    const onSubmitHandler = e => {
        e.preventDefault();
        updateUser({id: params?.id, body: {name, email, role}});
    };
    useEffect(() => {
        if(data?.user) {
            setName(data?.user?.name);
            setEmail(data?.user?.email);
            setRole(data?.user?.role);
        }
        if (isError) {
            toast.error(error?.data?.message);
          }
          if(isSuccess) {
            toast.success('User updated');
            navigate('/admin/users');
          }
    }, [data, isError, isSuccess]);
  return (
    <AdminLayout>
<div className="row wrapper">
      <div className="col-10 col-lg-8">
        <form
          className="shadow rounded bg-body"
          action="#"
          method="post"
          enctype="multipart/form-data"
          onSubmit={onSubmitHandler}
        >
          <h2 className="mb-4">Update Profile</h2>

          <div className="mb-3">
            <label htmlFor="name_field" className="form-label"> Name </label>
            <input
              type="text"
              id="name_field"
              className="form-control"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email_field" className="form-label"> Email </label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div class="mb-3">
            <label for="role_field" class="form-label">Role</label>
            <select id="role_field" class="form-select" name="role" value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>


          <button type="submit" className="btn update-btn w-100" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update'}</button>
        </form>
      </div>
    </div>
    </AdminLayout>
  )
}
