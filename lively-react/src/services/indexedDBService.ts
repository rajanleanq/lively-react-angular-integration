import { LunchItem, Order, User } from "../types";

interface AuthStateData {
  currentUser: User | null;
  isAuthenticated: boolean;
  timestamp: number;
}

class IndexedDBService {
  private dbName = "LunchManagementDB";
  private version = 2;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("lunchItems")) {
          db.createObjectStore("lunchItems", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("orders")) {
          const orderStore = db.createObjectStore("orders", { keyPath: "id" });
          orderStore.createIndex("userId", "userId", { unique: false });
          orderStore.createIndex("date", "date", { unique: false });
        }

        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("authState")) {
          db.createObjectStore("authState");
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  private async getStore(
    storeName: string,
    mode: IDBTransactionMode
  ): Promise<IDBObjectStore> {
    const db = await this.ensureDB();
    const transaction = db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveAuthState(authData: {
    currentUser: User | null;
    isAuthenticated: boolean;
  }): Promise<void> {
    try {
      const store = await this.getStore("authState", "readwrite");

      const authStateData: AuthStateData = {
        ...authData,
        timestamp: Date.now(),
      };

      const request = store.put(authStateData, "current");
      await this.promisifyRequest(request);
    } catch (error) {
      console.error("Failed to save auth state to IndexedDB:", error);
      throw error;
    }
  }

  async getAuthState(): Promise<{
    currentUser: User | null;
    isAuthenticated: boolean;
  } | null> {
    try {
      const store = await this.getStore("authState", "readonly");
      const request = store.get("current");
      const result: AuthStateData = await this.promisifyRequest(request);

      if (!result) return null;

      const EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days
      const isExpired = Date.now() - result.timestamp > EXPIRATION_TIME;

      if (isExpired) {
        await this.clearAuthState();
        return null;
      }

      return {
        currentUser: result.currentUser,
        isAuthenticated: result.isAuthenticated,
      };
    } catch (error) {
      console.error("Failed to get auth state from IndexedDB:", error);
      return null;
    }
  }

  async clearAuthState(): Promise<void> {
    try {
      const store = await this.getStore("authState", "readwrite");
      const request = store.delete("current");
      await this.promisifyRequest(request);
    } catch (error) {
      console.error("Failed to clear auth state from IndexedDB:", error);
      throw error;
    }
  }

  async getLunchItems(): Promise<LunchItem[]> {
    const store = await this.getStore("lunchItems", "readonly");
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveLunchItem(item: LunchItem): Promise<void> {
    const store = await this.getStore("lunchItems", "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteLunchItem(id: string): Promise<void> {
    const store = await this.getStore("lunchItems", "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const store = await this.getStore("orders", "readonly");
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const store = await this.getStore("orders", "readonly");
    return new Promise((resolve, reject) => {
      const index = store.index("userId");
      const request = index.getAll(userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveOrder(order: Order): Promise<void> {
    const store = await this.getStore("orders", "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.put(order);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteOrder(id: string): Promise<void> {
    const store = await this.getStore("orders", "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUsers(): Promise<User[]> {
    const store = await this.getStore("users", "readonly");
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveUser(user: User): Promise<void> {
    const store = await this.getStore("users", "readwrite");
    return new Promise((resolve, reject) => {
      const request = store.put(user);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBService = new IndexedDBService();
