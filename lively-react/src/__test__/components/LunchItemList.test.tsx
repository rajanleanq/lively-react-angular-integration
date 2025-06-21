import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LunchItemList } from '../../pages/UserDashboard/component/LunchItemList';
import { LunchItem } from '../../types';

const mockItems: LunchItem[] = [
  {
    id: '1',
    name: 'Caesar Salad',
    price: 12.99,
    description: 'Fresh romaine lettuce',
    category: 'Salads',
    available: true,
  },
  {
    id: '2',
    name: 'Burger',
    price: 15.99,
    description: 'Juicy beef burger',
    category: 'Burgers',
    available: true,
  },
  {
    id: '3',
    name: 'Greek Salad',
    price: 11.99,
    description: 'Mediterranean salad',
    category: 'Salads',
    available: false,
  },
];

describe('LunchItemList', () => {
  it('renders lunch items correctly', () => {
    render(<LunchItemList items={mockItems} />);
    
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('Greek Salad')).toBeInTheDocument();
  });

  it('groups items by category', () => {
    render(<LunchItemList items={mockItems} />);
    
    expect(screen.getByText('Salads')).toBeInTheDocument();
    expect(screen.getByText('Burgers')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(<LunchItemList items={[]} />);
    
    expect(screen.getByText('No lunch items available')).toBeInTheDocument();
    expect(screen.getByText('Check back later or contact the administrator.')).toBeInTheDocument();
  });

  it('calls onAddToOrder when add button clicked', () => {
    const mockOnAddToOrder = vi.fn();
    render(<LunchItemList items={mockItems} onAddToOrder={mockOnAddToOrder} />);
    
    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[0]);
    
    expect(mockOnAddToOrder).toHaveBeenCalledWith(mockItems[0]);
  });

  it('shows selected items correctly', () => {
    const selectedItems = [mockItems[0]];
    render(
      <LunchItemList 
        items={mockItems} 
        selectedItems={selectedItems}
        onAddToOrder={vi.fn()} 
      />
    );
    
    expect(screen.getByText('Added')).toBeInTheDocument();
  });

  it('does not show add button when showAddButton is false', () => {
    render(
      <LunchItemList 
        items={mockItems} 
        showAddButton={false}
      />
    );
    
    expect(screen.queryByText('Add')).not.toBeInTheDocument();
  });

  it('handles items without category', () => {
    const itemsWithoutCategory = [
      {
        id: '1',
        name: 'Mystery Item',
        price: 10.99,
        available: true,
      },
    ];

    render(<LunchItemList items={itemsWithoutCategory} />);
    
    expect(screen.getByText('Other')).toBeInTheDocument();
    expect(screen.getByText('Mystery Item')).toBeInTheDocument();
  });

  it('correctly identifies selected items', () => {
    const selectedItems = [mockItems[0]];
    render(
      <LunchItemList 
        items={mockItems} 
        selectedItems={selectedItems}
        onAddToOrder={vi.fn()} 
      />
    );
    
    const addedButtons = screen.getAllByText('Added');
    expect(addedButtons).toHaveLength(1);
  });
});