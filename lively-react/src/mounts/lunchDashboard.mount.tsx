import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../store";
import { AdminDashboard } from "../pages/AdminDashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "../theme";
import { initializeMockData } from "../services/mockDataService";
import { initializeAuth, fetchUsers } from "../store/slices/authSlice";
import { fetchLunchItems } from "../store/slices/lunchItemsSlice";
import { fetchOrders } from "../store/slices/ordersSlice";
import Loading from "../components/Loading";

const DashboardWrapper: React.FC = () => {
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    const initialize = async () => {
      try {
        await store.dispatch(initializeAuth()).unwrap();
        await initializeMockData();

        await Promise.all([
          store.dispatch(fetchUsers()),
          store.dispatch(fetchLunchItems()),
          store.dispatch(fetchOrders()),
        ]);

        setIsInitialized(true);
      } catch (error) {
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  if (!isInitialized) {
    return (
     <Loading />
    );
  }

  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AdminDashboard />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
};

export function mountLunchDashboard(container: HTMLElement): () => void {
  const root = createRoot(container);
  root.render(<DashboardWrapper />);

  return () => {
    root.unmount();
  };
}

if (typeof window !== "undefined") {
  (window as any).LunchDashboard = {
    mountLunchDashboard,
  };
}
