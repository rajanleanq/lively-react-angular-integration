import { format } from "date-fns";
import { Order } from "../../../types";

export const normalizeDate = (date: string | Date): string => {
  const parsedDate = new Date(date);
  return format(parsedDate, "yyyy-MM-dd");
};

export const getDateRangeOrders = (
  range: "today" | "month",
  orders: Order[]
): Order[] => {
  const now = new Date();
  const startDate =
    range === "today"
      ? format(now, "yyyy-MM-dd")
      : format(new Date(now.getFullYear(), now.getMonth(), 1), "yyyy-MM-dd");
  return (orders || []).filter(
    (order) => normalizeDate(order.date) >= startDate
  );
};
