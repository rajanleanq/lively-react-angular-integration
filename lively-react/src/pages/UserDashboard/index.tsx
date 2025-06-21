import { ShoppingCart } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../../hooks";
import LunchOrderForm from "./component/LunchOrderForm";
import { useCallback, useState } from "react";
import { LunchItem } from "../../types";
import { AvailableItems } from "./component/AvailableItems";

function UserDashboard() {
  const { currentUser } = useAppSelector((state) => state.auth);
  const [selectedItems, setSelectedItems] = useState<LunchItem[]>([]);
  const handleSetSelectedItems = useCallback(
    (items: React.SetStateAction<LunchItem[]>) => {
      setSelectedItems(items);
    },
    []
  );
  return (
    <Box display={"flex"} width={"100%"} marginTop={8}>
      <Box width={"100%"}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <ShoppingCart
            sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
            aria-hidden
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {currentUser?.name}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Place your daily lunch order below
          </Typography>
        </Box>
        <AvailableItems
          selectedItems={selectedItems}
          setSelectedItems={handleSetSelectedItems}
        />
      </Box>
      <LunchOrderForm
        selectedItems={selectedItems}
        setSelectedItems={handleSetSelectedItems}
      />
    </Box>
  );
}
export default UserDashboard;
