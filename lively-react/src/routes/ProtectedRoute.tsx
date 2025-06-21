import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks";
import Layout from "../components/Layout";
import Loading from "../components/Loading";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  if (!isInitialized) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
