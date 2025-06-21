import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Order, LunchItem } from "../../types";
import { indexedDBService } from "../../services/indexedDBService";

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  userOrders: Order[];
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
  userOrders: [],
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const orders = await indexedDBService.getOrders();
  return orders;
});
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async ({ userId }: { userId: string }) => {
    const orders = await indexedDBService.getUserOrders(userId);
    return orders;
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData: {
    userId: string;
    userName: string;
    items: LunchItem[];
  }) => {
    const order: Order = {
      id: Date.now().toString(),
      userId: orderData.userId,
      userName: orderData.userName,
      date: new Date().toISOString().split("T")[0],
      items: orderData.items,
      totalAmount: orderData.items.reduce((sum, item) => sum + item.price, 0),
      status: "confirmed",
    };
    await indexedDBService.saveOrder(order);
    return order;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }: { orderId: string; status: Order["status"] }) => {
    const orders = await indexedDBService.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      const updatedOrder = { ...order, status };
      await indexedDBService.saveOrder(updatedOrder);
      return updatedOrder;
    }
    throw new Error("Order not found");
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id: string) => {
    await indexedDBService.deleteOrder(id);
    return id;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user orders";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        );
      });
  },
});

export default ordersSlice.reducer;
