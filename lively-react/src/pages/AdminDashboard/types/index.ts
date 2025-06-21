import { FilterOption, LunchItem, Order } from "../../../types";

export interface DashboardStats {
  todayOrders: number;
  todayAmount: number;
  monthlyOrders: number;
  monthlyAmount: number;
  popularItems: Array<{ item: LunchItem; count: number }>;
}

export interface DashboardProps {
  orders: Order[];
  items: LunchItem[];
  filterOptions: FilterOption[];
  title: string;
  csvExportConfig: {
    filenamePrefix: string;
    generateCSV: (orders: Order[], filename: string) => void;
  };
  statsConfig: Array<{
    title: string;
    value: string;
    icon: JSX.Element;
    bgColor: string;
    iconColor: string;
  }>;
}
