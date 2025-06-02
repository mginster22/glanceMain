export interface OrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  userId?: number;
  token?: string;
  items: OrderItemInput[];
  total: number;
}
export interface Order {
  id: number;
  userId: number;
  total: number;
  createdAt: string;
  // и т.д. можно добавить поля из prisma модели order
}
