import React, { memo, useMemo } from "react";
import { Box, Typography, Grid } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { LunchItem } from "../../../types";
import LunchItemCard from "./LunchItemCard";

interface LunchItemListProps {
  items: LunchItem[];
  onAddToOrder?: (item: LunchItem) => void;
  selectedItems?: LunchItem[];
  showAddButton?: boolean;
}

export const LunchItemList: React.FC<LunchItemListProps> = memo(
  ({ items, onAddToOrder, selectedItems = [], showAddButton = true }) => {
    const groupedItems = useMemo(() => {
      return items?.reduce((acc, item) => {
        const category = item.category || "Other";
        acc[category] = acc[category] || [];
        acc[category]?.push(item);
        return acc;
      }, {} as Record<string, LunchItem[]>);
    }, [items]);

    const isItemSelected = useMemo(
      () => (itemId: string) =>
        selectedItems?.some((item) => item.id === itemId),
      [selectedItems]
    );

    if (items.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 12 }}>
          <AccessTimeIcon
            sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            aria-hidden="true"
          />
          <Typography
            variant="h6"
            fontWeight="medium"
            color="text.primary"
            gutterBottom
            aria-label="no-lunch-items-title"
          >
            No lunch items available
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            aria-label="no-lunch-items-message"
          >
            Check back later or contact the administrator.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <Box key={category}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, borderBottom: 1, borderColor: "divider", pb: 1 }}
            >
              {category}
            </Typography>
            <Grid container spacing={3} aria-label="lunch-item-list">
              {categoryItems.map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
                  <LunchItemCard
                    item={item}
                    onAddToOrder={onAddToOrder}
                    isSelected={isItemSelected(item.id)}
                    showAddButton={showAddButton}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    );
  }
);
