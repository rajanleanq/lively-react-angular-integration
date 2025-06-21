import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateCSVReport } from '../../utils/csvExport';
import { Order } from '../../types';

const mockBlob = vi.fn().mockImplementation((content, options) => ({
  content,
  options,
  size: content[0].length,
  type: options.type,
}));

const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();

const mockClick = vi.fn();
const mockSetAttribute = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

const mockElement = {
  click: mockClick,
  setAttribute: mockSetAttribute,
  style: {},
  download: '',
  href: '',
};

const mockCreateElement = vi.fn();

Object.defineProperty(globalThis, 'Blob', {
  value: mockBlob,
  writable: true,
});

Object.defineProperty(globalThis, 'URL', {
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  },
  writable: true,
});

Object.defineProperty(globalThis, 'document', {
  value: {
    createElement: mockCreateElement,
    body: {
      appendChild: mockAppendChild,
      removeChild: mockRemoveChild,
    },
  },
  writable: true,
});

const mockOrders: Order[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    date: '2024-01-15',
    items: [
      { id: '1', name: 'Caesar Salad', price: 12.99, available: true },
      { id: '2', name: 'Burger', price: 15.99, available: true },
    ],
    totalAmount: 28.98,
    status: 'confirmed',
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    date: '2024-01-16',
    items: [
      { id: '1', name: 'Caesar Salad', price: 12.99, available: true },
    ],
    totalAmount: 12.99,
    status: 'pending',
  },
];

describe('generateCSVReport', () => {
  beforeEach(() => {
    mockCreateObjectURL.mockReturnValue('blob:mock-url');
    mockCreateElement.mockReturnValue(mockElement);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('generates CSV with correct headers', () => {
    generateCSVReport(mockOrders, 'test-report.csv');

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockBlob).toHaveBeenCalledWith(
      expect.arrayContaining([expect.stringContaining('Order ID')]),
      { type: 'text/csv;charset=utf-8;' }
    );
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });

  it('handles empty orders array', () => {
    generateCSVReport([], 'empty-report.csv');

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockBlob).toHaveBeenCalled();
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });

  it('formats order data correctly', () => {
    generateCSVReport(mockOrders, 'test-report.csv');
    const csvContent = mockBlob.mock.calls[0][0][0];
    expect(csvContent).toContain('John Doe');
    expect(csvContent).toContain('Jane Smith');
    expect(csvContent).toContain('28.98');
    expect(csvContent).toContain('confirmed');
  });

  it('creates download link with correct filename', () => {
    generateCSVReport(mockOrders, 'custom-filename.csv');
    expect(mockSetAttribute).toHaveBeenCalledWith('download', 'custom-filename.csv');
    expect(mockSetAttribute).toHaveBeenCalledWith('href', 'blob:mock-url');
  });

  it('formats items list correctly in CSV', () => {
    generateCSVReport(mockOrders, 'test-report.csv');

    const csvContent = mockBlob.mock.calls[0][0][0];
    expect(csvContent).toContain('Caesar Salad');
    expect(csvContent).toContain('Burger');
  });
});