import { AuthState, User } from "../types";
import { indexedDBService } from "./indexedDBService";

class AuthPersistenceService {
  private readonly SESSION_KEY = "lunch-app-session";

  private get isClient(): boolean {
    return typeof window !== "undefined";
  }

  async saveAuthState(authData: {
    currentUser: User | null;
    isAuthenticated: boolean;
  }): Promise<void> {
    try {
      await indexedDBService.saveAuthState(authData);

      if (this.isClient) {
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(authData));
      }
    } catch (error) {
      console.error("Failed to save auth state:", error);
      if (this.isClient) {
        try {
          sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(authData));
        } catch (sessionError) {
          console.error("Failed to save to sessionStorage:", sessionError);
        }
      }
    }
  }

  async loadAuthState(): Promise<Partial<AuthState>> {
    if (!this.isClient) return {};

    try {
      const persistedState = await indexedDBService.getAuthState();
      if (persistedState) {
        return persistedState;
      }

      const sessionData = sessionStorage.getItem(this.SESSION_KEY);
      if (sessionData) {
        return JSON.parse(sessionData);
      }

      return {};
    } catch (error) {
      console.error("Failed to load auth state:", error);
      return {};
    }
  }

  async clearAuthState(): Promise<void> {
    try {
      await indexedDBService.clearAuthState();
      if (this.isClient) {
        sessionStorage.removeItem(this.SESSION_KEY);
      }
    } catch (error) {
      console.error("Failed to clear auth state:", error);
    }
  }

  isSessionValid(): boolean {
    if (!this.isClient) return false;

    try {
      const sessionData = sessionStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return false;

      const { currentUser, isAuthenticated } = JSON.parse(sessionData);
      return !!(currentUser && isAuthenticated);
    } catch {
      return false;
    }
  }
}

export const authPersistence = new AuthPersistenceService();
