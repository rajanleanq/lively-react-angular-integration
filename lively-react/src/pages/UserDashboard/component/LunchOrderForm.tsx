import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import React, { useCallback, useMemo, useState } from "react";
import { LunchItem } from "../../../types";
import { createOrder } from "../../../store/slices/ordersSlice";

interface LunchOrderFormProps {
  selectedItems: LunchItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<LunchItem[]>>;
}

function LunchOrderForm({
  selectedItems,
  setSelectedItems,
}: LunchOrderFormProps) {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalAmount = useMemo(
    () => selectedItems?.reduce((sum, item) => sum + item.price, 0).toFixed(2),
    [selectedItems]
  );
  const handleRemoveFromOrder = useCallback(
    (itemId: string) => {
      setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
    },
    [setSelectedItems]
  );

  const handleSubmitOrder = useCallback(async () => {
    if (!currentUser || selectedItems.length === 0) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        createOrder({
          userId: currentUser.id,
          userName: currentUser.name,
          items: selectedItems,
        })
      ).unwrap();
      setSelectedItems([]);
    } catch (error) {
      console.error("Failed to submit order:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [setSelectedItems]);
  return (
    <Box
      sx={{
        position: "fixed",
        right: 0,
        top: 64,
        width: "250px",
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        zIndex: 1000,
      }}
      aria-label="lunch-order-form"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          height: "100%",
          borderLeft: "1px solid #ccc",
        }}
      >
        <Typography
          fontWeight="bold"
          sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
        >
          <ShoppingCartIcon sx={{ color: "primary.main" }} aria-hidden />
          Order Your Lunch
        </Typography>

        {selectedItems.length > 0 ? (
          <Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {selectedItems.map((item) => (
                <Paper
                  key={item.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveFromOrder(item.id)}
                    aria-label={`Remove ${item.name} from order`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              ))}
            </Box>
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
                aria-label={"Total amount is $" + totalAmount}
              >
                <Typography variant="h6" fontWeight="bold">
                  Total:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "success.dark",
                    fontWeight: "bold",
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: 18, mr: 0.5 }} aria-hidden/>
                  <Typography variant="body1">{totalAmount}</Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} />
                  ) : (
                    <ShoppingCartIcon />
                  )
                }
                onClick={handleSubmitOrder}
                disabled={isSubmitting || selectedItems.length === 0}
                fullWidth
                sx={{ textTransform: "none" }}
                aria-label="Place order"
              >
                {isSubmitting ? "Submitting..." : "Place Order"}
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography
            variant="body2"
            color="warning.main"
            aria-label="no-items-in-order"
            aria-description="currently no items in your order, click on add to order to add items"
          >
            Currently no items in your order, click on add to order to add items
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default React.memo(LunchOrderForm);
