export interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  status: "pending" | "completed" | "shipped";
  totalPrice: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  plantId: string;
  quantity: number;
  price: number;
}
