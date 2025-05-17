import {axiosInstance} from "./instance";
import { Product } from "@/app/generated/prisma";

export const getAllProducts = async (): Promise<Product[]> => {
    return (await axiosInstance.get<Product[]>("/products")).data;
};
export const getProductById = async (id: number) => {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) throw new Error('Product not found');
  return response.json();
};