import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, {
  setCurrentUser,
  logout,
  clearError,
  loginWithCredentials,
  initializeAuth,
  fetchUsers,
  simulateLogin,
} from "../../store/slices/authSlice";
import { User } from "../../types";

describe("authSlice", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
    });
  });
  it("should handle initializeAuth.fulfilled with persisted user", () => {
    const persistedState = {
      currentUser: {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        isAdmin: false,
      },
      isAuthenticated: true,
    };

    const action = {
      type: initializeAuth.fulfilled.type,
      payload: persistedState,
    };

    store.dispatch(action);
    const state = store.getState().auth;

    expect(state.isInitialized).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.currentUser).toEqual(persistedState.currentUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should handle fetchUsers.fulfilled", () => {
    const users = [
      { id: "1", name: "User 1", email: "u1@example.com", isAdmin: false },
    ];

    store.dispatch({
      type: fetchUsers.fulfilled.type,
      payload: users,
    });

    const state = store.getState().auth;
    expect(state.users).toEqual(users);
    expect(state.loading).toBe(false);
  });

  it("should handle simulateLogin.fulfilled", () => {
    const user = {
      id: "1",
      name: "Sim User",
      email: "sim@example.com",
      isAdmin: false,
    };

    store.dispatch({
      type: simulateLogin.fulfilled.type,
      payload: user,
    });

    const state = store.getState().auth;
    expect(state.currentUser).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should handle initial state", () => {
    const state = store.getState().auth;
    expect(state.currentUser).toBe(null);
    expect(state.users).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isInitialized).toBe(false);
  });

  it("should handle setCurrentUser", () => {
    const user: User = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      isAdmin: false,
    };

    store.dispatch(setCurrentUser(user));
    const state = store.getState().auth;

    expect(state.currentUser).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should handle logout", () => {
    const user: User = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      isAdmin: false,
    };
    store.dispatch(setCurrentUser(user));

    store.dispatch(logout());
    const state = store.getState().auth;

    expect(state.currentUser).toBe(null);
    expect(state.isAuthenticated).toBe(false);
  });

  it("should handle clearError", () => {
    const action = {
      type: loginWithCredentials.rejected.type,
      error: { message: "Login failed" },
    };
    store.dispatch(action);

    store.dispatch(clearError());
    const state = store.getState().auth;

    expect(state.error).toBe(null);
  });

  it("should handle loginWithCredentials.pending", () => {
    const action = { type: loginWithCredentials.pending.type };
    store.dispatch(action);
    const state = store.getState().auth;

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle loginWithCredentials.fulfilled", () => {
    const user: User = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      isAdmin: false,
    };

    const action = {
      type: loginWithCredentials.fulfilled.type,
      payload: user,
    };

    store.dispatch(action);
    const state = store.getState().auth;

    expect(state.loading).toBe(false);
    expect(state.currentUser).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should handle loginWithCredentials.rejected", () => {
    const action = {
      type: loginWithCredentials.rejected.type,
      error: { message: "Invalid credentials" },
    };

    store.dispatch(action);
    const state = store.getState().auth;

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Invalid credentials");
    expect(state.isAuthenticated).toBe(false);
  });
});
