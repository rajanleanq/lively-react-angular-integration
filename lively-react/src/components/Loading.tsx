import { Restaurant } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
      }}
      data-testid="loading"
      data-cy="loading"
      id="loading"
      role="loading"
      aria-busy="true"
    >
      <Box sx={{ textAlign: "center" }}>
        <Restaurant sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading lunch system...
        </Typography>
      </Box>
    </Box>
  );
}
