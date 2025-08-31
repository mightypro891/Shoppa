
'use client';

import type { Order, OrderStatus } from './types';

const ORDERS_KEY = 'lautech_shoppa_orders';

const getOrdersFromStorage = (): Order[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const savedOrders = localStorage.getItem(ORDERS_KEY);
    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch (error) {
    console.error('Failed to parse orders from localStorage', error);
    return [];
  }
};

const saveOrdersToStorage = (orders: Order[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Failed to save orders to localStorage', error);
  }
};


export async function getAllOrders(): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, 50)); 
  return getOrdersFromStorage().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const orders = getOrdersFromStorage();
  return orders.find(order => order.id === id);
}

export async function createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newOrder: Order = {
    ...orderData,
    id: Math.random().toString(36).substr(2, 9),
    status: 'Order Placed',
    createdAt: new Date().toISOString(),
  };
  const currentOrders = getOrdersFromStorage();
  saveOrdersToStorage([newOrder, ...currentOrders]);
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | undefined> {
    await new Promise(resolve => setTimeout(resolve, 100));
    let allOrders = getOrdersFromStorage();
    let updatedOrder: Order | undefined;
    
    const updatedOrders = allOrders.map(order => {
        if (order.id === orderId) {
            updatedOrder = { ...order, status };
            return updatedOrder;
        }
        return order;
    });

    if (updatedOrder) {
        saveOrdersToStorage(updatedOrders);
    }
    
    return updatedOrder;
}
