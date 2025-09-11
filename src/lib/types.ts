
export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
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
    isComplete: boolean;
}

export type AdminRole = 'Super Admin' | 'Website Admin' | 'Products Admin' | 'Normal Admin';

export interface AdminUser {
  email: string;
  role: AdminRole;
  managedCategories?: string[]; // New field for category restrictions
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  authorName: string;
  authorImage?: string | null;
  rating: number; // 1 to 5
  text: string;
  createdAt: string;
}

export interface CelebrationPopupConfig {
    title: string;
    message: string;
    isActive: boolean;
}

export type DealStatus = 'pending' | 'approved' | 'rejected';

export interface DealSubmission {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    originalPrice: number;
    proposedPrice: number;
    submittedBy: string;
    submittedAt: string;
    status: DealStatus;
}
