import React, { useEffect, useState } from 'react';
import { useRegisterMutation } from '../../redux/api/authApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

export default function Register() {
    const [userData, setUserData] = useState({name: '', email: '', password: ''});
    const onChangeHandler = e => setUserData({...userData, [e.target.name]: e.target.value});
  const [register, { isLoading, error, data }] = useRegisterMutation();
  const navigate = useNavigate();
  const {isUserAuthenticated} = useSelector(state => state.auth);
  useEffect(() => {
    if(isUserAuthenticated) {
      navigate('/');
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error, data, isUserAuthenticated]);
  const handleSubmitHandler = e => {
    e.preventDefault();
    register(userData);
  };
  return (
    <div className="row wrapper">
    <div className="col-10 col-lg-5">
      <form
        className="shadow rounded bg-body"
        onSubmit={handleSubmitHandler}
      >
        <h2 className="mb-4">Register</h2>

        <div className="mb-3">
          <label htmlFor="name_field" className="form-label">Name</label>
          <input
            type="text"
            id="name_field"
            className="form-control"
            name="name"
            value={userData.name}
            onChange={onChangeHandler}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email_field" className="form-label">Email</label>
          <input
            type="email"
            id="email_field"
            className="form-control"
            name="email"
            value={userData.email}
            onChange={onChangeHandler}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password_field" className="form-label">Password</label>
          <input
            type="password"
            id="password_field"
            className="form-control"
            name="password"
            value={userData.password}
            onChange={onChangeHandler}
          />
        </div>

        <button id="register_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
      {isLoading ? 'Registering...' : 'REGISTER'}
        </button>
      </form>
    </div>
  </div>
  );
}
