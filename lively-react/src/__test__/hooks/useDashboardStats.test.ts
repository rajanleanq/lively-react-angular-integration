import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDashboardStats } from '../../pages/AdminDashboard/hooks';
import { Order, LunchItem } from '../../types';

const mockItems: LunchItem[] = [
  {
    id: '1',
    name: 'Caesar Salad',
    price: 12.99,
    category: 'Salads',
    available: true,
  },
  {
    id: '2',
    name: 'Burger',
    price: 15.99,
    category: 'Burgers',
    available: true,
  },
];

const mockOrders: Order[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    date: new Date().toISOString().split('T')[0],
    items: [mockItems[0]],
    totalAmount: 12.99,
    status: 'confirmed',
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    date: new Date().toISOString().split('T')[0],
    items: [mockItems[1]],
    totalAmount: 15.99,
    status: 'confirmed',
  },
  {
    id: '3',
    userId: 'user1',
    userName: 'John Doe',
    date: '2024-01-01',
    items: [mockItems[0], mockItems[1]],
    totalAmount: 28.98,
    status: 'confirmed',
  },
];

describe('useDashboardStats', () => {
  it('calculates today stats correctly', () => {
    const { result } = renderHook(() => useDashboardStats(mockOrders, mockItems));

    expect(result.current.todayOrders).toBe(2);
    expect(result.current.todayAmount).toBe(28.98);
  });

  it('calculates monthly stats correctly', () => {
    const { result } = renderHook(() => useDashboardStats(mockOrders, mockItems));

    expect(result.current.monthlyOrders).toBeGreaterThanOrEqual(2);
    expect(result.current.monthlyAmount).toBeGreaterThanOrEqual(28.98);
  });

  it('calculates popular items correctly', () => {
    const { result } = renderHook(() => useDashboardStats(mockOrders, mockItems));

    expect(result.current.popularItems).toHaveLength(2);
    expect(result.current.popularItems[0].item.name).toBe('Caesar Salad');
    expect(result.current.popularItems[0].count).toBe(1);
  });

  it('handles empty orders array', () => {
    const { result } = renderHook(() => useDashboardStats([], mockItems));

    expect(result.current.todayOrders).toBe(0);
    expect(result.current.todayAmount).toBe(0);
    expect(result.current.monthlyOrders).toBe(0);
    expect(result.current.monthlyAmount).toBe(0);
    expect(result.current.popularItems).toHaveLength(0);
  });

  it('handles empty items array', () => {
    const { result } = renderHook(() => useDashboardStats(mockOrders, []));

    expect(result.current.popularItems).toHaveLength(0);
  });
});