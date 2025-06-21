import React from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Package as PackageIcon,
} from "lucide-react";
import { LunchItem } from "../../../types";

interface Props {
  lunchItems: LunchItem[];
  handleEdit: (item: LunchItem) => void;
  handleDelete: (id: string) => void;
}

const ItemList: React.FC<Props> = ({ handleDelete, handleEdit, lunchItems }) => {
  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }} aria-label="item-list-title">
        <Typography variant="h5" fontWeight="bold">
          Current Items ({lunchItems?.length})
        </Typography>
      </Box>
      <Box sx={{ overflowX: "auto" }} aria-label="item-list">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lunchItems?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {item.name}
                  </Typography>
                  {item.description && (
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{item.category || "Uncategorized"}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: item.available ? "success.light" : "error.light",
                      color: "white",
                      display: "inline-block",
                    }}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(item)}
                    color="primary"
                    data-testid={`edit-button-${item.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(item.id)}
                    color="error"
                    data-testid={`delete-button-${item.id}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {lunchItems.length === 0 && (
          <Box sx={{ textAlign: "center", p: 6 }}>
            <PackageIcon />
            <Typography variant="h6" fontWeight="medium" color="text.primary">
              No items yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start by adding your first lunch item.
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default React.memo(ItemList);