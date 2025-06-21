import { SelectChangeEvent } from "@mui/material";
import { ItemFormData } from "../type";
import { LunchItem } from "../../../types";
import { FormEvent, useState, useCallback } from "react";
import { useAppDispatch } from "../../../hooks";
import {
  addLunchItem,
  deleteLunchItem,
  updateLunchItem,
} from "../../../store/slices/lunchItemsSlice";

interface UseItemManagerResult {
  formData: ItemFormData;
  isAddingItem: boolean;
  editingItem: string | null;
  handleInputChange: (
    field: keyof ItemFormData
  ) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleToggleAvailable: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleEdit: (item: LunchItem) => void;
  handleDelete: (id: string) => void;
  handleAddNew: () => void;
  resetForm: () => void;
  handleSelectChange: (
    field: keyof ItemFormData
  ) => (e: SelectChangeEvent<string>) => void;
}

export const useItemManager = (): UseItemManagerResult => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    price: 0,
    description: "",
    category: "",
    available: true,
  });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const handleInputChange = useCallback(
    (field: keyof ItemFormData) =>
      (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const value =
          field === "price" ? parseFloat(e.target.value) || 0 : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
      },
    []
  );
  const handleSelectChange = useCallback(
    (field: keyof ItemFormData) =>
      (
        e: SelectChangeEvent<string>
      ) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
      },
    []
  );

  const handleToggleAvailable = useCallback(() => {
    setFormData((prev) => ({ ...prev, available: !prev.available }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        if (editingItem) {
          await dispatch(
            updateLunchItem({
              id: editingItem,
              ...formData,
            })
          ).unwrap();
        } else {
          await dispatch(addLunchItem(formData)).unwrap();
        }
        resetForm();
      } catch (error) {
        console.error("Failed to save item:", error);
      }
    },
    [dispatch, editingItem, formData]
  );

  const handleEdit = useCallback(
    (item: LunchItem) => {
      setFormData({
        name: item.name,
        price: item.price,
        description: item.description || "",
        category: item.category || "",
        available: item.available ?? true,
      });
      setEditingItem(item.id);
      setIsAddingItem(false);
    },
    []
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        try {
          await dispatch(deleteLunchItem(id)).unwrap();
        } catch (error) {
          console.error("Failed to delete item:", error);
        }
      }
    },
    [dispatch]
  );

  const handleAddNew = useCallback(() => {
    resetForm();
    setIsAddingItem(true);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      price: 0,
      description: "",
      category: "",
      available: true,
    });
    setIsAddingItem(false);
    setEditingItem(null);
  }, []);

  return {
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
  };
};