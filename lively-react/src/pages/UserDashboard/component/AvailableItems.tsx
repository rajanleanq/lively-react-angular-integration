import React, { useCallback, useMemo } from "react";
import { Typography } from "@mui/material";
import { LunchItem } from "../../../types";
import { LunchItemList } from "./LunchItemList";
import { useAppSelector } from "../../../hooks";

interface AvailableItemsProps {
  selectedItems: LunchItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<LunchItem[]>>;
}

export const AvailableItems: React.FC<AvailableItemsProps> = React.memo(
  ({ selectedItems, setSelectedItems }) => {
    const { items } = useAppSelector((state) => state.lunchItems);
    const itemsStable = useMemo(
      () => items?.filter?.((item) => item.available),
      [items]
    );
    const handleAddToOrder = useCallback(
      (item: LunchItem) => {
        if (!selectedItems.some((selected) => selected.id === item.id)) {
          setSelectedItems((prev) => [...prev, item]);
        }
      },
      [setSelectedItems]
    );
    return (
      <React.Fragment>
        <Typography
          variant="h6"
          color="success.dark"
          fontWeight="bold"
          sx={{ mb: 3 }}
          data-cy="available-items-title"
        >
          Available Items
        </Typography>
        <LunchItemList
          items={itemsStable}
          onAddToOrder={handleAddToOrder}
          selectedItems={selectedItems}
        />
      </React.Fragment>
    );
  }
);
