import { format } from "date-fns";
import { LunchItem, Order } from "../../../types";
import { useMemo } from "react";
import { DashboardStats } from "../types";

export const useDashboardStats = (
  orders: Order[],
  items: LunchItem[]
): DashboardStats => {
  return useMemo(() => {
    const now = new Date();
    const todayStart = format(now, "yyyy-MM-dd");
    const monthStart = format(
      new Date(now.getFullYear(), now.getMonth(), 1),
      "yyyy-MM-dd"
    );

    const todayOrders = orders.filter(
      (order) => format(new Date(order.date), "yyyy-MM-dd") === todayStart
    );
    const monthlyOrders = orders.filter((order) => order.date >= monthStart);

    const todayAmount = todayOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const monthlyAmount = monthlyOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const itemCounts: Record<string, number> = {};
    monthlyOrders.forEach((order) => {
      order.items.forEach((item) => {
        itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .map(([itemId, count]) => ({
        item: items.find((item) => item.id === itemId)!,
        count,
      }))
      .filter((entry) => !!entry.item)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      todayOrders: todayOrders.length,
      todayAmount,
      monthlyOrders: monthlyOrders.length,
      monthlyAmount,
      popularItems,
    };
  }, [orders, items]);
};
