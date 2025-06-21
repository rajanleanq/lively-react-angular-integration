import { Box, Grid, Paper, Typography } from "@mui/material";
import React from "react";

interface Props {
  icon: JSX.Element;
  title: string;
  amount: string;
  bgColor: string;
}
const StatsCard: React.FC<Props> = ({ icon, title, amount, bgColor }) => (
  <Grid item xs={12} sm={6} md={3} aria-label="stats-card">
    <Paper
      elevation={2}
      sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
    >
      <Box sx={{ p: 2, bgcolor: bgColor, borderRadius: 2 }} aria-hidden="true">
        {icon}
      </Box>
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          aria-label={"stats-card-title-" + title}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          fontWeight="bold"
          aria-label={"stats-card-amount-" + amount}
        >
          {amount}
        </Typography>
      </Box>
    </Paper>
  </Grid>
);
export default React.memo(StatsCard);
