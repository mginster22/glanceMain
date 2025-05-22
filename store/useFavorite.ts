import { getFavorite } from "@/services/favorite";
import { ProductItem } from "@/types/products";
import { create } from "zustand";

interface StoreState {
  favorites: ProductItem[];
  loading: boolean;
  fetchFavorite: () => Promise<void>;
}

export const useFavoriteStore = create<StoreState>()((set, get) => ({
  favorites: [],
  loading: false,

  fetchFavorite: async () => {
    set({ loading: true });
    try {
      const data = await getFavorite();
      console.log(data);
      set({ favorites: data.data });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      set({ loading: false });
    }
  },


}));
