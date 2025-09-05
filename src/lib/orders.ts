
import type { Order, OrderStatus, CartItem, CustomerDetails } from './types';

// --- In-memory database for prototype ---
let orders: Order[] = [];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getAllOrders(): Promise<Order[]> {
  await delay(100);
  // Return orders sorted by date, descending
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  await delay(50);
  return orders.find(o => o.id === id);
}

export async function getOrderByUserEmail(email: string): Promise<Order | undefined> {
  await delay(50);
  const userOrders = orders.filter(o => o.customer.email === email)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return userOrders[0];
}

export async function createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
  await delay(200);
  const newOrder: Order = {
    id: `order_${Date.now()}`,
    ...orderData,
    status: 'Order Placed' as OrderStatus,
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    await delay(100);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
        orders[orderIndex].status = status;
        return { ...orders[orderIndex] }; // Return a copy
    }
    return undefined;
}
