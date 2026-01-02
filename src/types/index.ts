export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'makanan' | 'minuman' | 'snack';
  calories?: number;
}

export interface CartItem extends Product {
  quantity: number;
  notes?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  order_type: 'pickup' | 'reservation';
  pickup_time: string | null;
  table_number: number | null;
  guest_count: number | null;
  items: OrderItem[];
  subtotal: number;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid';
  created_at: string;
  updated_at: string;
}
