import React, { useEffect, useState } from 'react'
import { useResetPasswordMutation } from '../../redux/api/authApi'
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function ResetPassword() {
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [resetPassword, {error, isSuccess, isLoading}] = useResetPasswordMutation();
    const {isUserAuthenticated} = useSelector(state => state.auth);
    const navigate = useNavigate();
    const params = useParams();
    useEffect(() => {
        if(isUserAuthenticated) {
          navigate('/');
        }
        if (error) {
          toast.error(error?.data?.message);
        }
        if(isSuccess) {
            toast.success('Password reset successfully')
            navigate('/login')
        }
      }, [error, isUserAuthenticated, isSuccess]);

    const submitButtonHandler = e => {
        e.preventDefault();
        if(password !==confirmedPassword) {
            return toast.error("Password doesn't match. Please try again!")
        }
        const data = {password, confirmedPassword}
        resetPassword({token: params?.token, body: data})
    }
  return (
    <div class="row wrapper">
    <div class="col-10 col-lg-5">
      <form
        class="shadow rounded bg-body"
       onSubmit={submitButtonHandler}
      >
        <h2 class="mb-4">New Password</h2>
        <div class="mb-3">
          <label for="password_field" class="form-label">Password</label>
          <input
            type="password"
            id="password_field"
            class="form-control"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div class="mb-3">
          <label for="confirm_password_field" class="form-label"
            >Confirm Password</label
          >
          <input
            type="password"
            id="confirm_password_field"
            class="form-control"
            name="confirm_password"
            value={confirmedPassword}
            onChange={e => setConfirmedPassword(e.target.value)}
          />
        </div>

        <button id="new_password_button" type="submit" class="btn w-100 py-2">
          Set Password
        </button>
      </form>
    </div>
  </div>
  )
}
