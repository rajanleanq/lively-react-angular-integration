import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import ordersReducer, {
  createOrder,
  updateOrderStatus,
  deleteOrder,
  fetchOrders,
  fetchUserOrders,
} from "../../store/slices/ordersSlice";
import { Order, LunchItem } from "../../types";

describe("ordersSlice", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { orders: ordersReducer },
    });
  });

  it("should handle initial state", () => {
    const state = store.getState().orders;
    expect(state.orders).toEqual([]);
    expect(state.userOrders).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it("should handle fetchOrders.pending", () => {
    const action = { type: fetchOrders.pending.type };
    store.dispatch(action);
    const state = store.getState().orders;

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle fetchOrders.fulfilled", () => {
    const orders: Order[] = [
      {
        id: "1",
        userId: "user1",
        userName: "John Doe",
        date: "2024-01-15",
        items: [],
        totalAmount: 25.99,
        status: "confirmed",
      },
    ];

    const action = {
      type: fetchOrders.fulfilled.type,
      payload: orders,
    };

    store.dispatch(action);
    const state = store.getState().orders;

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(orders);
  });

  it("should handle fetchUserOrders.fulfilled", () => {
    const userOrders: Order[] = [
      {
        id: "1",
        userId: "user1",
        userName: "John Doe",
        date: "2024-01-15",
        items: [],
        totalAmount: 25.99,
        status: "confirmed",
      },
    ];

    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: userOrders,
    };

    store.dispatch(action);
    const state = store.getState().orders;

    expect(state.loading).toBe(false);
    expect(state.userOrders).toEqual(userOrders);
  });

  it("should handle createOrder.fulfilled", () => {
    const items: LunchItem[] = [
      {
        id: "1",
        name: "Caesar Salad",
        price: 12.99,
        available: true,
      },
    ];

    const newOrder: Order = {
      id: "1",
      userId: "user1",
      userName: "John Doe",
      date: "2024-01-15",
      items,
      totalAmount: 12.99,
      status: "confirmed",
    };

    const action = {
      type: createOrder.fulfilled.type,
      payload: newOrder,
    };

    store.dispatch(action);
    const state = store.getState().orders;

    expect(state.orders).toHaveLength(1);
    expect(state.orders[0]).toEqual(newOrder);
  });

  it("should handle updateOrderStatus.fulfilled", () => {
    const order: Order = {
      id: "1",
      userId: "user1",
      userName: "John Doe",
      date: "2024-01-15",
      items: [],
      totalAmount: 12.99,
      status: "pending",
    };

    store.dispatch({
      type: createOrder.fulfilled.type,
      payload: order,
    });

    const updatedOrder = { ...order, status: "confirmed" as const };

    store.dispatch({
      type: updateOrderStatus.fulfilled.type,
      payload: updatedOrder,
    });

    const state = store.getState().orders;
    expect(state.orders[0].status).toBe("confirmed");
  });

  it("should handle deleteOrder.fulfilled", () => {
    const order: Order = {
      id: "1",
      userId: "user1",
      userName: "John Doe",
      date: "2024-01-15",
      items: [],
      totalAmount: 12.99,
      status: "confirmed",
    };

    store.dispatch({
      type: createOrder.fulfilled.type,
      payload: order,
    });

    store.dispatch({
      type: deleteOrder.fulfilled.type,
      payload: "1",
    });

    const state = store.getState().orders;
    expect(state.orders).toHaveLength(0);
  });

  it("should handle error states", () => {
    const action = {
      type: fetchOrders.rejected.type,
      error: { message: "Network error" },
    };

    store.dispatch(action);
    const state = store.getState().orders;

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Network error");
  });
});
