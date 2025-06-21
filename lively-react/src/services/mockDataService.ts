import { LunchItem, User } from '../types';
import { indexedDBService } from './indexedDBService';

export const mockLunchItems: LunchItem[] = [
  {
    id: '1',
    name: 'Caesar Salad',
    price: 12.99,
    description: 'Fresh romaine lettuce with parmesan and croutons',
    category: 'Salads',
    available: true,
  },
  {
    id: '2',
    name: 'Grilled Chicken Sandwich',
    price: 15.99,
    description: 'Juicy grilled chicken with avocado and bacon',
    category: 'Sandwiches',
    available: true,
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    price: 18.99,
    description: 'Classic pizza with fresh mozzarella and basil',
    category: 'Pizza',
    available: true,
  },
  {
    id: '4',
    name: 'Beef Burger',
    price: 16.99,
    description: 'Angus beef patty with cheese and fries',
    category: 'Burgers',
    available: true,
  },
  {
    id: '5',
    name: 'Pasta Carbonara',
    price: 14.99,
    description: 'Creamy pasta with pancetta and parmesan',
    category: 'Pasta',
    available: true,
  },
  {
    id: '6',
    name: 'Fish & Chips',
    price: 17.99,
    description: 'Beer-battered fish with crispy fries',
    category: 'Mains',
    available: true,
  },
];

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@company.com',
    isAdmin: true,
  },
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    isAdmin: false,
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    isAdmin: false,
  },
];

export async function initializeMockData(): Promise<void> {
  try {
    await indexedDBService.init();

    // Check if data pailai exists garxa
    const existingItems = await indexedDBService.getLunchItems();
    const existingUsers = await indexedDBService.getUsers();

    // Initialize lunch items if empty xa vane
    if (existingItems.length === 0) {
      for (const item of mockLunchItems) {
        await indexedDBService.saveLunchItem(item);
      }
    }

    // Initialize users if empty xa vane
    if (existingUsers.length === 0) {
      for (const user of mockUsers) {
        await indexedDBService.saveUser(user);
      }
    }
  } catch (error) {
    console.error('Failed to initialize mock data:', error);
  }
}