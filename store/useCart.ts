import { create } from "zustand";
import { CartItem } from "@/types/products";
import {
  getCart,
  addToCart as appiAddToCart,
  removeFromCart,
  updateCartItem,
} from "@/services/cart";
import { useProductStore } from "./useProduct";

interface StoreState {
  cart: CartItem[];
  active: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, count?: number) => Promise<void>;
  deleteFromCart: (productId: number) => Promise<void>;
  updateCartItem: (productId: number, count: number) => Promise<void>;

  openCart: () => void;
  closeCart: () => void;
}
export const useCartStore = create<StoreState>()((set, get) => ({
  cart: [],
  active: false,
  fetchCart: async () => {
    try {
      const data = await getCart();
      set({ cart: data.items });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
  addToCart: async (productId: number, count?: number) => {
    try {
      await appiAddToCart(productId, count);

      await get().fetchCart();

      const updatedCart = get().cart;
      const cartItem = updatedCart.find((item) => item.productId === productId);
      const countInCart = cartItem?.count ?? 0;

      const { products, setProductQuantity } = useProductStore.getState();
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      const initialQuantity = product.initialQuantity ?? 0;

      const newQuantity = initialQuantity - countInCart;
      setProductQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  },

  deleteFromCart: async (productId: number) => {
    try {
      await removeFromCart(productId); // удаляем на сервере

      // Обновляем корзину
      await get().fetchCart();

      // Обновляем продукты (если надо)
      await useProductStore.getState().fetchProducts();

      // После полной загрузки обновленных данных получаем состояние заново
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
    }
  },

  // Пример для useCartStore (или твоего стора корзины)
  updateCartItem: async (productId: number, newCount: number) => {
    try {
      await updateCartItem(productId, newCount); // вызов API для обновления корзины

      // Получаем свежую корзину с сервера (или локально)
      await get().fetchCart();

      // Получаем обновленное состояние корзины
      const updatedCart = get().cart;

      // Ищем количество товара в корзине для этого productId
      const cartItem = updatedCart.find((item) => item.productId === productId);
      const countInCart = cartItem?.count ?? 0;

      // Получаем продукты из стора продуктов
      const { products, setProductQuantity } = useProductStore.getState();

      // Находим исходное количество товара (initialQuantity)
      const product = products.find((p) => p.id === productId);
      if (!product) {
        console.warn("Product not found in product store:", productId);
        return;
      }
      const initialQuantity = product.initialQuantity ?? 0;

      // Вычисляем остаток: изначальное количество минус количество в корзине
      const newQuantity = initialQuantity - countInCart;

      // Обновляем количество в сторе продуктов (оставшийся остаток)
      setProductQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  },

  openCart: () => set({ active: true }),
  closeCart: () => set({ active: false }),
}));
