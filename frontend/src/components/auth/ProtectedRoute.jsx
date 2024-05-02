import React from 'react';
import { useSelector } from 'react-redux';
import {Navigate} from 'react-router-dom';
import Loader from '../layout/loader';

export default function ProtectedRoute({children, admin}) {
    const {isUserAuthenticated, loading, user} = useSelector(state => state.auth);
    if(loading) {
        return <Loader/>
    }
    if(!isUserAuthenticated) {
        return <Navigate to='/login' replace/>
    }
    if(admin && user?.role !=='admin') {
        return <Navigate to='/' replace/>
    }
  return children;
}
