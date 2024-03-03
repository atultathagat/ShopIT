import React, { useEffect, useState } from 'react';
import { useUpdateUserProfileMutation } from '../../redux/api/userAPI';
import Cookies from 'universal-cookie';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import UserLayout from '../layout/UserLayout';

export default function UpdateProfile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [updateUserProfile, { isLoading, error, isSuccess }] = useUpdateUserProfileMutation();
    const onSubmitHandler = e => {
        e.preventDefault();
        updateUserProfile({email, name, token: new Cookies().get('token')});
    };
    const {user} = useSelector(state => state.auth);
    useEffect(() => {
        if(user) {
            setName(user?.name);
            setEmail(user?.email);
        }
        if (error) {
            toast.error(error?.data?.message);
          }
          if(isSuccess) {
            toast.success('User updated');
            navigate('/me/profile');
          }
    }, [user, error, isSuccess]);
  return (
    <UserLayout>
            <div className="row wrapper">
      <div className="col-10 col-lg-8">
        <form
          className="shadow rounded bg-body"
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

          <button type="submit" className="btn update-btn w-100">{isLoading ? 'Updating...' : 'Update'}</button>
        </form>
      </div>
    </div>
    </UserLayout>
  );
}
