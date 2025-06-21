import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Save as SaveIcon, X as CloseIcon } from "lucide-react";
import { ItemFormData } from "../type";
import React, { FormEvent } from "react";

interface Props {
  formData: ItemFormData;
  editingItem: string | null;
  handleInputChange: (
    field: keyof ItemFormData
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (
    field: keyof ItemFormData
  ) => (e: SelectChangeEvent<string>) => void;
  handleToggleAvailable: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  resetForm: () => void;
}

function ItemForm({
  editingItem,
  formData,
  handleInputChange,
  handleToggleAvailable,
  handleSubmit,
  resetForm,
  handleSelectChange,
}: Props) {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        {editingItem ? "Edit Item" : "Add New Item"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <TextField
            required
            label="Item Name"
            value={formData.name}
            onChange={handleInputChange("name")}
            variant="outlined"
            data-testid="name-input"
            role="input"
            aria-label="item-name-input"
          />
          <TextField
            required
            label="Price"
            type="number"
            value={formData.price}
            onChange={handleInputChange("price")}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            variant="outlined"
            data-testid="price-input"
            role="input"
            aria-label="price-input"
          />
          <FormControl variant="outlined">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={handleSelectChange("category")}
              label="Category"
              data-testid="category-select"
              role="input"
              aria-label="category-select"
            >
              <MenuItem value="">Select category</MenuItem>
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  value={category}
                  data-testid="category-option"
                  aria-label={"category-option-" + category}
                >
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.available}
                onChange={handleToggleAvailable}
              />
            }
            label="Available"
            data-testid="available-checkbox"
            aria-label="available-checkbox"
          />
        </Box>
        <TextField
          label="Description"
          value={formData.description}
          onChange={handleInputChange("description")}
          multiline
          rows={3}
          variant="outlined"
          data-testid="description-input"
          aria-label="description-input"
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            type="submit"
            data-testid="submit-button"
            aria-label="submit-button"
          >
            {editingItem ? "Update" : "Add"} Item
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CloseIcon />}
            onClick={resetForm}
            data-testid="cancel-button"
            aria-label="cancel-button"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default React.memo(ItemForm);

const categories = [
  "Salads",
  "Sandwiches",
  "Pizza",
  "Burgers",
  "Pasta",
  "Mains",
  "Desserts",
  "Beverages",
];
