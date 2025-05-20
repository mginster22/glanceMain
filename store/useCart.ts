import { create } from "zustand";
import { CartItem } from "@/types/products";
import {
  getCart,
  addToCart as apiAddToCart,
  removeFromCart,
  updateCartItem,
  clearCart
} from "@/services/cart";
import { useProductStore } from "./useProduct";

interface StoreState {
  cart: CartItem[];
  active: boolean;
  loading: boolean;

  fetchCart: () => Promise<void>;
  addToCart: (productId: number, count?: number) => Promise<void>;
  deleteFromCart: (productId: number) => Promise<void>;
  updateCartItem: (productId: number, count: number) => Promise<void>;
  clearCart:()=>Promise<void>;

  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<StoreState>()((set, get) => ({
  cart: [],
  active: false,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const data = await getCart();
      set({ cart: data.items.sort((a, b) => a.productId - b.productId) });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (productId: number, count?: number) => {
    set({ loading: true });
    try {
      await apiAddToCart(productId, count);
      await get().fetchCart();

      const updatedCart = get().cart;
      const cartItem = updatedCart.find((item) => item.productId === productId);
      const countInCart = cartItem?.count ?? 0;

      const { products, setProductQuantity } = useProductStore.getState();
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const newQuantity = (product.initialQuantity ?? 0) - countInCart;
      setProductQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      set({ loading: false });
    }
  },

  deleteFromCart: async (productId: number) => {
    set({ loading: true });
    try {
      await removeFromCart(productId);
      await get().fetchCart();
      await useProductStore.getState().fetchProducts();

      const updatedCart = get().cart;
      const { products, setProductQuantity } = useProductStore.getState();

      products.forEach((product) => {
        const itemInCart = updatedCart.find((i) => i.productId === product.id);
        const countInCart = itemInCart?.count ?? 0;
        const newQuantity = (product.initialQuantity ?? 0) - countInCart;
        setProductQuantity(product.id, newQuantity);
      });
    } catch (error) {
      console.error("Error deleting from cart:", error);
    } finally {
      set({ loading: false });
    }
  },
  clearCart:async()=>{
    set({ loading: true });
    try {
      await clearCart();
      await get().fetchCart();
      await useProductStore.getState().fetchProducts();
    } catch (error) {
      console.error("Error deleting from cart:", error);
    } finally {
      set({ loading: false });
    }
  },

  updateCartItem: async (productId: number, newCount: number) => {
    set({ loading: true });
    try {
      await updateCartItem(productId, newCount);
      await get().fetchCart();

      const updatedCart = get().cart;
      const cartItem = updatedCart.find((item) => item.productId === productId);
      const countInCart = cartItem?.count ?? 0;

      const { products, setProductQuantity } = useProductStore.getState();
      const product = products.find((p) => p.id === productId);
      if (!product) {
        console.warn("Product not found in product store:", productId);
        return;
      }

      const initialQuantity = product.initialQuantity ?? 0;
      const newQuantity = initialQuantity - countInCart;
      setProductQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error updating cart item:", error);
    } finally {
      set({ loading: false });
    }
  },

  openCart: () => set({ active: true }),
  closeCart: () => set({ active: false }),
}));
