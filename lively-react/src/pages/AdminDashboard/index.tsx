import {
  AttachMoney,
  CalendarToday,
  ShoppingBag,
  TrendingUp,
} from "@mui/icons-material";
import { useAppSelector } from "../../hooks";
import { LunchItem, Order } from "../../types";
import { Dashboard } from "./Dashboard";
import { useDashboardStats } from "./hooks";
import { generateCSVReport } from "../../utils/csvExport";

export const AdminDashboard: React.FC = () => {
  const orders: Order[] = useAppSelector((state) => state.orders.orders);
  const items: LunchItem[] = useAppSelector((state) => state.lunchItems.items);
  const stats = useDashboardStats(orders, items);

  return (
    <Dashboard
      orders={orders}
      items={items}
      title="Admin Dashboard"
      filterOptions={[
        { id: "today", label: "Today", days: 0 },
        { id: "week", label: "Week", days: 7 },
        { id: "month", label: "Month", days: 30 },
      ]}
      csvExportConfig={{
        filenamePrefix: "lunch-orders",
        generateCSV: (orders) => {
          generateCSVReport(orders, `report.csv`);
        },
      }}
      statsConfig={[
        {
          title: "Today's Orders",
          value: stats.todayOrders.toString(),
          icon: <CalendarToday sx={{ fontSize: 32, color: "primary.dark" }} />,
          bgColor: "primary.light",
          iconColor: "primary.dark",
        },
        {
          title: "Today's Revenue",
          value: `$${stats.todayAmount.toFixed(2)}`,
          icon: <AttachMoney sx={{ fontSize: 32, color: "success.dark" }} />,
          bgColor: "success.light",
          iconColor: "success.dark",
        },
        {
          title: "Monthly Orders",
          value: stats.monthlyOrders.toString(),
          icon: <ShoppingBag sx={{ fontSize: 32, color: "secondary.dark" }} />,
          bgColor: "secondary.light",
          iconColor: "secondary.dark",
        },
        {
          title: "Monthly Revenue",
          value: `$${stats.monthlyAmount.toFixed(2)}`,
          icon: <TrendingUp sx={{ fontSize: 32, color: "warning.dark" }} />,
          bgColor: "warning.light",
          iconColor: "warning.dark",
        },
      ]}
    />
  );
};
