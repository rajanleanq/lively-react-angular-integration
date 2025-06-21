import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import { LunchItem } from "../../../types";

const PopularItems: React.FC<{
  popularItems: Array<{ item: LunchItem; count: number }>;
}> = ({ popularItems }) => (
  <Paper elevation={3} sx={{ p: 3 }}>
    <Typography variant="h6" fontWeight="bold" mb={2} aria-label="popular-items-title">
      Popular Items This Month
    </Typography>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} aria-label="popular-items-list">
      {popularItems.map((item, index) => (
        <Paper
          key={item.item.id}
          elevation={1}
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                color: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {index + 1}
            </Box>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {item.item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${item.item.price.toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body1" fontWeight="medium">
              {item.count} orders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${(item.count * item.item.price).toFixed(2)} revenue
            </Typography>
          </Box>
        </Paper>
      ))}
      {popularItems.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No orders yet this month
        </Typography>
      )}
    </Box>
  </Paper>
);

export default React.memo(PopularItems);
