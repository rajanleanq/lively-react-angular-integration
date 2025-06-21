import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import DownloadIcon from "@mui/icons-material/Download";
import { useAppSelector } from "../../hooks";
import { generateCSVReport } from "../../utils/csvExport";
import CustomerActivity from "./../MonthlySummary/component/CustomerActivity";
import TopItems from "./../MonthlySummary/component/TopItems";
import StatsCard from "./../AdminDashboard/components/StatsCard";
import { AttachMoney } from "@mui/icons-material";

export const MonthlySummary: React.FC = () => {
  const { orders } = useAppSelector((state) => state.orders);
  const { items: lunchItems } = useAppSelector((state) => state.lunchItems);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  });

  const getMonthlyData = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const monthlyOrders = orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= startDate && orderDate <= endDate;
    });

    const totalOrders = monthlyOrders.length;
    const totalRevenue = monthlyOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const uniqueCustomers = new Set(monthlyOrders.map((order) => order.userId))
      .size;

    const dailyBreakdown: Record<string, { orders: number; revenue: number }> =
      {};
    for (let day = 1; day <= endDate.getDate(); day++) {
      const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const dayOrders = monthlyOrders.filter((order) => order.date === dateStr);
      dailyBreakdown[dateStr] = {
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      };
    }

    const itemCounts: Record<string, number> = {};
    monthlyOrders.forEach((order) => {
      order.items.forEach((item) => {
        itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
      });
    });

    const topItems = Object.entries(itemCounts)
      .map(([itemId, count]) => ({
        item: lunchItems.find((item) => item.id === itemId)!,
        count,
        revenue:
          count * (lunchItems.find((item) => item.id === itemId)?.price || 0),
      }))
      .filter((entry) => entry.item)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const customerStats = Object.entries(
      monthlyOrders.reduce((acc, order) => {
        if (!acc[order.userId]) {
          acc[order.userId] = {
            name: order.userName,
            orders: 0,
            totalSpent: 0,
          };
        }
        acc[order.userId].orders++;
        acc[order.userId].totalSpent += order.totalAmount;
        return acc;
      }, {} as Record<string, { name: string; orders: number; totalSpent: number }>)
    ).sort((a, b) => b[1].totalSpent - a[1].totalSpent);

    return {
      totalOrders,
      totalRevenue,
      uniqueCustomers,
      dailyBreakdown,
      topItems,
      customerStats,
      monthlyOrders,
    };
  }, [orders, lunchItems, selectedMonth]);

  const handleExportCSV = () => {
    const [year, month] = selectedMonth.split("-");
    generateCSVReport(
      getMonthlyData.monthlyOrders,
      `monthly-report-${year}-${month}.csv`
    );
  };

  const getMonthName = (monthString: string) => {
    const [year, month] = monthString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthString = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      return {
        value: monthString,
        label: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        }),
      };
    });
  }, []);
  const statsConfig = [
    {
      title: "Today's Orders",
      value: getMonthlyData.totalOrders,
      icon: <TrendingUpIcon sx={{ fontSize: 32, color: "primary.main" }} />,
      bgColor: "primary.light",
      iconColor: "primary.dark",
    },
    {
      title: "Total Revenue",
      value: `$${getMonthlyData.totalRevenue.toFixed(2)}`,
      icon: <AttachMoney sx={{ fontSize: 32, color: "success.dark" }} />,
      bgColor: "success.light",
      iconColor: "success.dark",
    },
    {
      title: "Unique Customers",
      value: getMonthlyData.uniqueCustomers,
      icon: <PeopleIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
      bgColor: "secondary.light",
      iconColor: "secondary.dark",
    },
  ];
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {xs: "flex-start", sm: "center"},
            flexDirection: { xs: "column", sm: "row" },
            gap: {xs: 3, sm: 0}
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            aria-label="monthly-summary-title"
          >
            <CalendarMonthIcon sx={{ color: "primary.main" }} aria-hidden="true" />
            Monthly Summary
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value as string)}
                label="Month"
              >
                {monthOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="success"
              startIcon={<DownloadIcon />}
              onClick={handleExportCSV}
              aria-label="Export monthly report as CSV"
              disabled={!getMonthlyData?.monthlyOrders?.length}
            >
              Export
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {statsConfig.map((stat, index) => (
          <StatsCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            amount={stat.value?.toString() || "N/A"}
            bgColor={stat.bgColor}
          />
        ))}
      </Grid>

      <TopItems
        month={getMonthName(selectedMonth)}
        getMonthlyData={getMonthlyData}
      />
      <CustomerActivity
        month={getMonthName(selectedMonth)}
        getMonthlyData={getMonthlyData}
      />
    </Box>
  );
};
