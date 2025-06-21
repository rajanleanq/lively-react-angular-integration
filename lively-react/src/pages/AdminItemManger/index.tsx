import React from "react";
import { Box, Container, Typography, Paper, Button } from "@mui/material";
import { Plus as PlusIcon, Package as PackageIcon } from "lucide-react";
import { useAppSelector } from "../../hooks";
import { useItemManager } from "./hook";
import ItemForm from "./component/ItemForm";
import ItemList from "./component/ItemList";

const AdminItemManager: React.FC = () => {
  const { items: lunchItems } = useAppSelector((state) => state.lunchItems);
  const {
    formData,
    isAddingItem,
    editingItem,
    handleInputChange,
    handleToggleAvailable,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleAddNew,
    resetForm,
    handleSelectChange
  } = useItemManager();

  return (
    <Container style={{ maxWidth: "100%" }} sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            aria-label="manage-items-title"
          >
            <PackageIcon />
            Manage Lunch Items
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlusIcon />}
            onClick={handleAddNew}
            data-testid="add-item-button"
            aria-label="add-item-button"
          >
            Add Item
          </Button>
        </Box>
      </Paper>

      {(isAddingItem || editingItem) && (
        <ItemForm
          editingItem={editingItem}
          formData={formData}
          handleInputChange={handleInputChange}
          handleToggleAvailable={handleToggleAvailable}
          handleSubmit={handleSubmit}
          resetForm={resetForm}
          handleSelectChange={handleSelectChange}
        />
      )}
      <ItemList
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        lunchItems={lunchItems}
      />
    </Container>
  );
};

export default AdminItemManager;
