import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { admin, loading } = useSelector(
    (state) => state.admin
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return admin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;