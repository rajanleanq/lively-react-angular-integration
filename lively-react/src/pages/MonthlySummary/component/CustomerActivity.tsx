import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { getMonthlyData } from "../type";
import React from "react";

function CustomerActivity({
  month,
  getMonthlyData,
}: {
  month: string;
  getMonthlyData: getMonthlyData;
}) {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }} aria-label="customer-activity-title">
        Customer Activity - {month}
      </Typography>
      <Box sx={{ overflowX: "auto" }}>
        <Table aria-label="customer-activity-table">
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Total Spent</TableCell>
              <TableCell>Avg. Order</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getMonthlyData?.customerStats?.map(([userId, stats]) => (
              <TableRow key={userId}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PeopleIcon
                      sx={{ fontSize: 20, color: "text.secondary" }}
                    />
                    <Typography variant="body2" fontWeight="medium">
                      {stats.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{stats.orders}</TableCell>
                <TableCell sx={{ color: "success.main", fontWeight: "medium" }}>
                  ${stats.totalSpent.toFixed(2)}
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  ${(stats.totalSpent / stats.orders).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}

export default React.memo(CustomerActivity);
