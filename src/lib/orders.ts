

import type { Order, OrderStatus } from './types';

let orders: Order[] = [];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export async function getAllOrders(): Promise<Order[]> {
  await delay(50); 
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  await delay(50);
  return orders.find(order => order.id === id);
}

export async function createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
  await delay(100);
  const newOrder: Order = {
    ...orderData,
    id: Math.random().toString(36).substr(2, 9),
    status: 'Order Placed',
    createdAt: new Date().toISOString(),
  };
  orders = [newOrder, ...orders];
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    await delay(100);
    let updatedOrder: Order | undefined;
    
    orders = orders.map(order => {
        if (order.id === orderId) {
            updatedOrder = { ...order, status };
            return updatedOrder;
        }
        return order;
    });

    return updatedOrder;
}
