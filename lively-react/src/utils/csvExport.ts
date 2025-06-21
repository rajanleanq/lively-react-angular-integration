import { Order } from '../types';

export function generateCSVReport(orders: Order[], filename: string): void {
  const headers = [
    'Order ID',
    'Customer Name',
    'Date',
    'Items',
    'Total Amount',
    'Status'
  ];

  const csvData = orders.map(order => [
    order.id,
    order.userName,
    order.date,
    order.items.map(item => `${item.name} ($${item.price.toFixed(2)})`).join('; '),
    order.totalAmount.toFixed(2),
    order.status
  ]);

  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}