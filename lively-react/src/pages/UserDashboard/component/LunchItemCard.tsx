import React, { memo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddIcon from "@mui/icons-material/Add";
import { LunchItem } from "../../../types";

interface LunchItemCardProps {
  item: LunchItem;
  onAddToOrder?: (item: LunchItem) => void;
  isSelected: boolean;
  showAddButton: boolean;
}

const LunchItemCard: React.FC<LunchItemCardProps> = memo(
  ({ item, onAddToOrder, isSelected, showAddButton }) => {
    return (
      <Card
        sx={{
          transition: "box-shadow 0.2s",
          border: isSelected ? "2px solid" : "none",
          borderColor: "primary.main",
          opacity: item.available ? 1 : 0.6,
          "&:hover": {
            boxShadow: (theme) => theme.shadows[6],
          },
        }}
        elevation={3}
      >
        <CardContent aria-label="lunch-item-card">
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="medium" aria-label={"lunch-item-"+item.name}>
              {item.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "success.main",
                fontWeight: "bold",
              }}
            >
              <AttachMoneyIcon sx={{ fontSize: 16, mr: 0.5 }} aria-hidden />
              <Typography variant="body2">{item.price.toFixed(2)}</Typography>
            </Box>
          </Box>
          {item.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {item.description}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Chip
              label={item.available ? "Available" : "Unavailable"}
              color={item.available ? "success" : "error"}
              size="small"
              sx={{ fontWeight: "medium" }}
            />
            {showAddButton && onAddToOrder && item.available && (
              <Button
                variant={isSelected ? "outlined" : "contained"}
                color={isSelected ? "success" : "primary"}
                startIcon={isSelected ? <AddShoppingCartIcon /> : <AddIcon />}
                onClick={() => onAddToOrder(item)}
                disabled={isSelected}
                sx={{ textTransform: "none" }}
                aria-label={
                  isSelected
                    ? `${item.name} added to order`
                    : `Add ${item.name} to order`
                }
              >
                {isSelected ? "Added" : "Add"}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }
);

export default LunchItemCard;
