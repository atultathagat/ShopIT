import React, { useEffect, useState } from 'react'
import { useUpdatePasswordMutation } from '../../redux/api/userAPI';
import UserLayout from '../layout/UserLayout';
import Cookies from 'universal-cookie';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function UpdatePassword() {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [updatePassword, { isLoading, error, isSuccess }] = useUpdatePasswordMutation();
    const submitButtonHandler  = e => {
        e.preventDefault();
        updatePassword({oldPassword, password, token: new Cookies().get('token')})
    }
    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message);
          }
          if(isSuccess) {
            toast.success('Password updated');
            navigate('/me/profile');
          }
    }, [error, isSuccess]);
  return (
    <UserLayout>
    <div class="row wrapper">
    <div class="col-10 col-lg-8">
      <form class="shadow rounded bg-body" onSubmit={e => submitButtonHandler(e)}>
        <h2 class="mb-4">Update Password</h2>
        <div class="mb-3">
          <label for="old_password_field" class="form-label">
            Old Password
          </label>
          <input
            type="password"
            id="old_password_field"
            class="form-control"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
          />
        </div>

        <div class="mb-3">
          <label for="new_password_field" class="form-label">
            New Password
          </label>
          <input
            type="password"
            id="new_password_field"
            class="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" class="btn update-btn w-100">
          {isLoading ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  </div>
  </UserLayout>
  )
}
