import { CartItem } from "@/types/products";
import { axiosInstance } from "./instance";

interface CartResponse {
  totalAmount: number;
  items: CartItem[];
}
export const getCart = async (): Promise<CartResponse> => {
  return (await axiosInstance.get<CartResponse>("/cart")).data;
};

export const addToCart = async (
  productId: number,
  count: number = 1
): Promise<void> => {
  await axiosInstance.post("/cart", {
    productId,
    count,
  });
};

export const removeFromCart = async (productId: number): Promise<void> => {
  await axiosInstance.request({
    url: "/cart",
    method: "delete",
    data: { productId },
  });
};
export const clearCart = async (): Promise<void> => {
  await axiosInstance.delete("/cart");
};

export const updateCartItem = async (
  productId: number,
  count: number
): Promise<void> => {
  await axiosInstance.patch("/cart", { productId, count });
};
