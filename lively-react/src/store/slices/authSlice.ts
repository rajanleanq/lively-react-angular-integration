import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../../types";
import { indexedDBService } from "../../services/indexedDBService";
import { authPersistence } from "../../services/authPersistenceService";

const initialState: AuthState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
};

export const initializeAuth = createAsyncThunk("auth/initialize", async () => {
  const persistedState = await authPersistence.loadAuthState();
  return persistedState;
});

export const fetchUsers = createAsyncThunk("auth/fetchUsers", async () => {
  const users = await indexedDBService.getUsers();
  return users;
});

export const simulateLogin = createAsyncThunk(
  "auth/simulateLogin",
  async (userId: string) => {
    const users = await indexedDBService.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
);

export const loginWithCredentials = createAsyncThunk(
  "auth/loginWithCredentials",
  async ({ email, isAdmin }: { email: string; isAdmin: boolean }) => {
    const users = await indexedDBService.getUsers();
    let user = users.find((u) => u.email === email);

    if (!user) {
      user = {
        id: Date.now().toString(),
        name: isAdmin ? "Admin User" : email.split("@")[0],
        email,
        isAdmin,
      };
      await indexedDBService.saveUser(user);
    }

    return user;
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await authPersistence.clearAuthState();
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        if (action.payload.currentUser && action.payload.isAuthenticated) {
          state.currentUser = action.payload.currentUser;
          state.isAuthenticated = action.payload.isAuthenticated;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(simulateLogin.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
      });
  },
});


export const { logout, setCurrentUser, clearError } = authSlice.actions;
export default authSlice.reducer;
