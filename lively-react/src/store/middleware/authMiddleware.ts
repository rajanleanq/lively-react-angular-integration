import { authPersistence } from "../../services/authPersistenceService";
import {
  loginWithCredentials,
  logoutUser,
  simulateLogin,
} from "../slices/authSlice";

export const createAuthPersistenceMiddleware = () => {
  /* eslint-disable */
  return (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    /* eslint-enable */

    if (
      action.type === loginWithCredentials.fulfilled.type ||
      action.type === simulateLogin.fulfilled.type ||
      action.type === logoutUser.fulfilled.type ||
      action.type === "auth/setCurrentUser"
    ) {
      const authState = store.getState().auth;
      authPersistence.saveAuthState({
        currentUser: authState.currentUser,
        isAuthenticated: authState.isAuthenticated,
      });
    }

    return result;
  };
};
