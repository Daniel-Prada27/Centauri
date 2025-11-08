// components/PublicRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const PublicRoute = () => {
  const user = auth.currentUser;

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;