import {axiosInstance} from "./instance"
import { Order } from "@/types/order";

interface CartItem {
  productId: number;
  quantity: number;
  price: number;
}

interface CreateOrderPayload {
  userId: number; // Только зарегистрированные
  items: CartItem[];
  total: number;
}
export const createOrder = async (orderData: CreateOrderPayload): Promise<Order> => {
  try {
    const response = await axiosInstance.post<Order>("/order", orderData);
    return response.data;
  } catch (error: any) {
    console.error(
      "Ошибка при создании заказа:",
      error.response?.data || error.message
    );
    throw error;
  }
};
