export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  aiHint: string;
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Order Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  cartItems: CartItem[];
  cartTotal: number;
  status: OrderStatus;
  createdAt: string;
}
