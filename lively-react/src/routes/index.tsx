import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { initializeMockData } from "../services/mockDataService";
import { initializeAuth, fetchUsers } from "../store/slices/authSlice";
import { fetchLunchItems } from "../store/slices/lunchItemsSlice";
import { fetchOrders, fetchUserOrders } from "../store/slices/ordersSlice";
import { LoginPage } from "../pages/LoginPage";
import Loading from "../components/Loading";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { AdminDashboard } from "../pages/AdminDashboard";
import { MonthlySummary } from "../pages/MonthlySummary";
import UserDashboard from "../pages/UserDashboard";
import AdminItemManager from "../pages/AdminItemManger/index.tsx";
import { store } from "../store/index.ts";
import { page_endpoints } from "../constants/endpoint.ts";

const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    currentUser,
    isInitialized,
    loading: authLoading,
  } = useAppSelector((state) => state.auth);
  const { loading: itemsLoading } = useAppSelector((state) => state.lunchItems);
  const { loading: ordersLoading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    const initialize = async () => {
      await dispatch(initializeAuth()).unwrap();

      await initializeMockData();
      dispatch(fetchUsers());
      dispatch(fetchLunchItems());
      dispatch(fetchOrders());

      const authState = store.getState().auth;
      if (authState.currentUser?.id) {
        dispatch(fetchUserOrders({ userId: authState.currentUser.id }));
      }
    };

    initialize();
  }, [dispatch]);

  if (!isInitialized || authLoading || itemsLoading || ordersLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route
        path={page_endpoints?.login}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to={currentUser?.isAdmin ? page_endpoints?.admin?.dashboard : page_endpoints?.user?.dashboard}
              replace
            />
          ) : (
            <Navigate to={page_endpoints?.login} replace />
          )
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path={page_endpoints?.user?.dashboard} element={<UserDashboard />} />
        <Route path={page_endpoints?.admin?.dashboard} element={<AdminDashboard />} />
        <Route path={page_endpoints?.admin?.items} element={<AdminItemManager />} />
        <Route path={page_endpoints?.admin?.summary} element={<MonthlySummary />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
