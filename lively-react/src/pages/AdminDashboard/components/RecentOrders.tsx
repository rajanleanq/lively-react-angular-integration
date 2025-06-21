import React, { useMemo, useState } from "react";
import { FilterOption, Order } from "../../../types";
import { format } from "date-fns";
import {
  Box,
  Chip,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { People, ShoppingBag } from "@mui/icons-material";

const RecentOrders: React.FC<{
  orders: Order[];
  filterOptions: FilterOption[];
}> = ({ orders, filterOptions }) => {
  const [selectedFilter, setSelectedFilter] = useState<
    "today" | "week" | "month"
  >(filterOptions[0]?.id || "today");
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const selected = filterOptions.find((f) => f.id === selectedFilter);
    if (!selected) return orders;

    const startDate =
      selected.days === 0
        ? format(now, "yyyy-MM-dd")
        : format(
            new Date(now.getTime() - selected.days * 24 * 60 * 60 * 1000),
            "yyyy-MM-dd"
          );

    return orders.filter(
      (order) => format(new Date(order.date), "yyyy-MM-dd") >= startDate
    );
  }, [orders, selectedFilter, filterOptions]);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
        aria-label="recent-orders-header"
      >
        <Typography variant="h6" fontWeight="bold">
          Recent Orders
        </Typography>
        <Tabs
          value={selectedFilter}
          onChange={(_, newValue) => setSelectedFilter(newValue)}
          aria-label="recent-orders-filters"
        >
          {filterOptions.map((filter) => (
            <Tab key={filter.id} label={filter.label} value={filter.id} aria-label={filter.label} />
          ))}
        </Tabs>
      </Box>
      <TableContainer aria-label="recent-orders-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.slice(0, 10).map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <People fontSize="small" color="action" />
                    <Typography variant="body2">{order.userName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(order.date).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {order.items.map((item, index) => (
                      <span key={item.id}>
                        {item.name}
                        {index < order.items.length - 1 && ", "}
                      </span>
                    ))}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight="medium"
                  >
                    ${order.totalAmount.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={
                      order.status === "confirmed"
                        ? "success"
                        : order.status === "pending"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredOrders.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <ShoppingBag sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
            <Typography color="text.secondary">
              No orders found for the selected period
            </Typography>
          </Box>
        )}
      </TableContainer>
    </Paper>
  );
};

export default React.memo(RecentOrders);
