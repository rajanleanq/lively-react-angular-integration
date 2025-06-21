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
import { getMonthlyData } from "../type";
import React from "react";

function TopItems({
  month,
  getMonthlyData,
}: {
  month: string;
  getMonthlyData: getMonthlyData;
}) {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }} aria-label="top-items-title">
        Top Items - {month}
      </Typography>
      <Box sx={{ overflowX: "auto" }}>
        <Table aria-label="top-items-table">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getMonthlyData?.topItems?.map((item, index) => (
              <TableRow key={item.item.id}>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      bgcolor: "primary.main",
                      color: "white",
                      borderRadius: "50%",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                    }}
                  >
                    {index + 1}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {item.item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ${item.item.price.toFixed(2)} each
                  </Typography>
                </TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell sx={{ color: "success.main", fontWeight: "medium" }}>
                  ${item.revenue.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}

export default React.memo(TopItems);
