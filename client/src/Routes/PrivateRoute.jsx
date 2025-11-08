// components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const PrivateRoute = () => {
  const user = auth.currentUser;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;