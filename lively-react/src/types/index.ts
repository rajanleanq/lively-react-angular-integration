export interface LunchItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  available?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  date: string;
  items: LunchItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AppState {
  lunchItems: LunchItem[];
  orders: Order[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export type AdminTab = "dashboard" | "items" | "summary";

export interface FilterOption {
  id: "today" | "week" | "month";
  label: string;
  days: number;
}
export const filterOptions: Array<FilterOption> = [
  { id: "today", label: "Today", days: 0 },
  { id: "week", label: "Week", days: 7 },
  { id: "month", label: "Month", days: 30 },
];

export interface AuthState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}
