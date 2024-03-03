import React from 'react';
import { useSelector } from 'react-redux';
import {Navigate} from 'react-router-dom';
import Loader from '../layout/loader';

export default function ProtectedRoute({children}) {
    const {isUserAuthenticated, loading} = useSelector(state => state.auth);
    if(loading) {
        return <Loader/>
    }
    if(!isUserAuthenticated) {
        return <Navigate to='/login' replace/>
    }
  return children;
}
