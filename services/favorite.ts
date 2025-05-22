import { ProductItem } from "@/types/products";
import { axiosInstance } from "./instance";

interface FavoriteResponse {
  data: ProductItem[];
}
export const getFavorite = async (): Promise<FavoriteResponse> => {
  return (await axiosInstance.get<FavoriteResponse>("/favorite")).data;
};
