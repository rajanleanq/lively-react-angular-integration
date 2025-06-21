import { LunchItem, Order } from "../../../types";

export interface getMonthlyData {
  totalOrders: number;
  totalRevenue: number;
  uniqueCustomers: number;
  dailyBreakdown: Record<
    string,
    {
      orders: number;
      revenue: number;
    }
  >;
  topItems: {
    item: LunchItem;
    count: number;
    revenue: number;
  }[];
  customerStats: [
    string,
    {
      name: string;
      orders: number;
      totalSpent: number;
    }
  ][];
  monthlyOrders: Order[];
}
