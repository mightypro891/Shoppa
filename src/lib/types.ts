export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  aiHint: string;
  tags?: string[];
  vendorId?: string; // To associate product with a "Normal Admin"
}

export interface DeletedProduct {
    product: Product;
    deletedBy: string;
    deletedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Order Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered';

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  cartItems: CartItem[];
  cartTotal: number;
  status: OrderStatus;
  createdAt: string;
}

export interface UserProfile {
    phone: string;
    address: string;
    city: string;
    balance: number;
}

export type AdminRole = 'Super Admin' | 'Website Admin' | 'Products Admin' | 'Normal Admin';

export interface AdminUser {
  email: string;
  role: AdminRole;
  managedCategories?: string[]; // New field for category restrictions
}
