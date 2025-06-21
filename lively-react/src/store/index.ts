import { configureStore } from "@reduxjs/toolkit";
import lunchItemsSlice from "./slices/lunchItemsSlice";
import ordersSlice from "./slices/ordersSlice";
import authSlice from "./slices/authSlice";
import { createAuthPersistenceMiddleware } from "./middleware/authMiddleware";

export const store = configureStore({
  reducer: {
    lunchItems: lunchItemsSlice,
    orders: ordersSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(createAuthPersistenceMiddleware()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
