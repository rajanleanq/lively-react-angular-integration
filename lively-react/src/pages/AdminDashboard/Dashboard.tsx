import React from "react";
import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { BarChart, GetApp } from "@mui/icons-material";
import { format } from "date-fns";
import { DashboardProps } from "./types";
import { useDashboardStats } from "./hooks";
import StatsCard from "./components/StatsCard";
import PopularItems from "./components/PopularItems";
import RecentOrders from "./components/RecentOrders";

export const Dashboard: React.FC<DashboardProps> = ({
  orders,
  items,
  filterOptions,
  title,
  csvExportConfig,
  statsConfig,
}) => {
  const stats = useDashboardStats(orders, items);

  const handleExportCSV = () => {
    const now = new Date();
    const startOfMonth = format(
      new Date(now.getFullYear(), now.getMonth(), 1),
      "yyyy-MM-dd"
    );
    const monthlyOrders = orders.filter((order) => order.date >= startOfMonth);
    csvExportConfig.generateCSV(
      monthlyOrders,
      `${csvExportConfig.filenamePrefix}-${now.getFullYear()}-${(
        now.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}.csv`
    );
  };

  return (
    <Box sx={{ py: 4, display: "flex", flexDirection: "column", gap: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BarChart />
            <Typography variant="h5" fontWeight="bold">
              {title}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<GetApp />}
            onClick={handleExportCSV}
            role="button"
            tabIndex={0}
            aria-label="export-dashboard-excel"
          >
            Export CSV
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {statsConfig.map((stat, index) => (
          <StatsCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            amount={stat.value}
            bgColor={stat.bgColor}
          />
        ))}
      </Grid>

      <PopularItems popularItems={stats.popularItems} />

      <RecentOrders orders={orders} filterOptions={filterOptions} />
    </Box>
  );
};
