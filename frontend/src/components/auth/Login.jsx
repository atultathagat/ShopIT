import React, { useEffect, useState } from 'react';
import { useLoginMutation } from '../../redux/api/authApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error, data }] = useLoginMutation();
    const {isUserAuthenticated} = useSelector(state => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if(isUserAuthenticated) {
      navigate('/');
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error, data, isUserAuthenticated]);
  const handleLoginSubmit = async e => {
    e.preventDefault();
    const loginReqBody = { email, password };
    await login(loginReqBody);
  };
  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={e => handleLoginSubmit(e)}
        >
          <h2 className="mb-4">Login</h2>
          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <a href="/password/forgot" className="float-end mb-4">
            Forgot Password?
          </a>

          <button
            id="login_button"
            type="submit"
            className="btn w-100 py-2"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'LOGIN'}
          </button>

          <div className="my-3">
            <a href="/register" className="float-end">
              New User?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
