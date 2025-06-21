import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LunchItem } from '../../types';
import { indexedDBService } from '../../services/indexedDBService';

interface LunchItemsState {
  items: LunchItem[];
  loading: boolean;
  error: string | null;
}

const initialState: LunchItemsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchLunchItems = createAsyncThunk(
  'lunchItems/fetchLunchItems',
  async () => {
    const items = await indexedDBService.getLunchItems();
    return items;
  }
);

export const addLunchItem = createAsyncThunk(
  'lunchItems/addLunchItem',
  async (item: Omit<LunchItem, 'id'>) => {
    const newItem: LunchItem = {
      ...item,
      id: Date.now().toString(),
      available: true,
    };
    await indexedDBService.saveLunchItem(newItem);
    return newItem;
  }
);

export const updateLunchItem = createAsyncThunk(
  'lunchItems/updateLunchItem',
  async (item: LunchItem) => {
    await indexedDBService.saveLunchItem(item);
    return item;
  }
);

export const deleteLunchItem = createAsyncThunk(
  'lunchItems/deleteLunchItem',
  async (id: string) => {
    await indexedDBService.deleteLunchItem(id);
    return id;
  }
);

const lunchItemsSlice = createSlice({
  name: 'lunchItems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLunchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLunchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLunchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch lunch items';
      })
      .addCase(addLunchItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateLunchItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteLunchItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default lunchItemsSlice.reducer;