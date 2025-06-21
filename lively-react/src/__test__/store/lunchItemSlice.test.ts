import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import lunchItemsReducer, {
  addLunchItem,
  updateLunchItem,
  deleteLunchItem,
  fetchLunchItems,
} from '../../store/slices/lunchItemsSlice';
import { LunchItem } from '../../types';

describe('lunchItemsSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { lunchItems: lunchItemsReducer },
    });
  });

  it('should handle initial state', () => {
    const state = store.getState().lunchItems;
    expect(state.items).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle fetchLunchItems.pending', () => {
    const action = { type: fetchLunchItems.pending.type };
    store.dispatch(action);
    const state = store.getState().lunchItems;

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle fetchLunchItems.fulfilled', () => {
    const items: LunchItem[] = [
      {
        id: '1',
        name: 'Caesar Salad',
        price: 12.99,
        description: 'Fresh romaine lettuce',
        category: 'Salads',
        available: true,
      },
    ];

    const action = {
      type: fetchLunchItems.fulfilled.type,
      payload: items,
    };

    store.dispatch(action);
    const state = store.getState().lunchItems;

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(items);
  });

  it('should handle fetchLunchItems.rejected', () => {
    const action = {
      type: fetchLunchItems.rejected.type,
      error: { message: 'Failed to fetch items' },
    };

    store.dispatch(action);
    const state = store.getState().lunchItems;

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch items');
  });

  it('should handle addLunchItem.fulfilled', () => {
    const newItem: LunchItem = {
      id: '1',
      name: 'Test Sandwich',
      price: 12.99,
      description: 'A delicious test sandwich',
      category: 'Sandwiches',
      available: true,
    };

    const action = {
      type: addLunchItem.fulfilled.type,
      payload: newItem,
    };

    store.dispatch(action);
    const state = store.getState().lunchItems;

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(newItem);
  });

  it('should handle updateLunchItem.fulfilled', () => {
    const originalItem: LunchItem = {
      id: '1',
      name: 'Original Item',
      price: 10.99,
      available: true,
    };

    store.dispatch({
      type: addLunchItem.fulfilled.type,
      payload: originalItem,
    });

    const updatedItem: LunchItem = {
      ...originalItem,
      name: 'Updated Item',
      price: 15.99,
    };

    store.dispatch({
      type: updateLunchItem.fulfilled.type,
      payload: updatedItem,
    });

    const state = store.getState().lunchItems;
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(updatedItem);
  });

  it('should handle deleteLunchItem.fulfilled', () => {
    const item: LunchItem = {
      id: '1',
      name: 'Item to Delete',
      price: 10.99,
      available: true,
    };

    store.dispatch({
      type: addLunchItem.fulfilled.type,
      payload: item,
    });

    store.dispatch({
      type: deleteLunchItem.fulfilled.type,
      payload: '1',
    });

    const state = store.getState().lunchItems;
    expect(state.items).toHaveLength(0);
  });

  it('should not update item if id does not exist', () => {
    const nonExistentItem: LunchItem = {
      id: 'non-existent',
      name: 'Non-existent Item',
      price: 10.99,
      available: true,
    };

    store.dispatch({
      type: updateLunchItem.fulfilled.type,
      payload: nonExistentItem,
    });

    const state = store.getState().lunchItems;
    expect(state.items).toHaveLength(0);
  });
});