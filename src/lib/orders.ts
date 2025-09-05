
'use server';

import type { Order, OrderStatus } from './types';

// --- PROTOTYPE DATA STORE ---
let orders: Order[] = [];

// Helper function to simulate database latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getAllOrders(): Promise<Order[]> {
  await delay(500);
  return JSON.parse(JSON.stringify(orders)).sort((a:Order, b:Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  await delay(200);
  return orders.find(o => o.id === id);
}

export async function getOrderByUserEmail(email: string): Promise<Order | undefined> {
    await delay(300);
    const userOrders = orders
        .filter(o => o.customer.email === email)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return userOrders[0];
}


export async function createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
  await delay(400);
  const newOrder: Order = {
    ...orderData,
    id: `order_${Date.now()}`,
    status: 'Order Placed',
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    await delay(300);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
        orders[orderIndex].status = status;
        return orders[orderIndex];
    }
    return undefined;
}
