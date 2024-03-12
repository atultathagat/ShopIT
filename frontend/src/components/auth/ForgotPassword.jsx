import React, { useEffect, useState } from 'react'
import { useForgotPasswordMutation } from '../../redux/api/authApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function () {
    const [email, setEmail] = useState('');
    const [forgotPassword, {isLoading, error, isSuccess}]= useForgotPasswordMutation()
    const {isUserAuthenticated} = useSelector(state => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if(isUserAuthenticated) {
          navigate('/');
        }
        if (error) {
          toast.error(error?.data?.message);
        }
        if(isSuccess) {
            toast.success('Email sent. Please check your inbox.')
        }
      }, [error, isUserAuthenticated, isSuccess]);
    const submitButtonHandler = e => {
        e.preventDefault();
        forgotPassword({email})
    }
  return (
    <div class="row wrapper">
    <div class="col-10 col-lg-5">
      <form
        class="shadow rounded bg-body"
        onSubmit={submitButtonHandler}
      >
        <h2 class="mb-4">Forgot Password</h2>
        <div class="mt-3">
          <label for="email_field" class="form-label">Enter Email</label>
          <input
            type="email"
            id="email_field"
            class="form-control"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <button
          id="forgot_password_button"
          type="submit"
          class="btn w-100 py-2"
          disabled={isLoading}
        >
         {isLoading ? 'Sending Email...' : 'Send Email'}
        </button>
      </form>
    </div>
  </div>
  )
}
