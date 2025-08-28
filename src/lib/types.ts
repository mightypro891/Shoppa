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
