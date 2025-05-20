import { create } from "zustand";
import { ProductItem } from "@/types/products";
import { getAllProducts, getProductById } from "@/services/products";
import { getCart } from "@/services/cart";

interface StoreState {
  products: ProductItem[];
  loading: boolean;
  singleProduct: ProductItem | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  setSingleProduct: (product: ProductItem) => void;
  decreaseProductQuantity: (id: number, count: number) => void;
  increaseProductQuantity: (productId: number, count?: number) => void;
  getProductById: (id: number) => void;
  setProducts: (products: ProductItem[]) => void;
  setProductQuantity: (productId: number, quantity: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}
export const useProductStore = create<StoreState>()((set, get) => ({
  products: [],
  loading: false,
  searchTerm: "",
  singleProduct: null,
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const [productsData, cartData] = await Promise.all([
        getAllProducts(),
        getCart(), // сразу получаем корзину
      ]);

      const productsWithInitial = productsData.map((product) => {
        const itemInCart = cartData.items.find(
          (item) => item.productId === product.id
        );
        const countInCart = itemInCart?.count ?? 0;

        return {
          ...product,
          initialQuantity: product.quantity + countInCart, // исходное = текущее + в корзине
        };
      });

      set({ products: productsWithInitial.sort((a, b) => a.id - b.id) });
    } catch (error) {
      console.error("Error fetching products:", error);
    }finally {
      set({ loading: false });
    }
  },
  fetchProductById: async (id: number) => {
    set({ loading: true });
    try {
      const product = await getProductById(id);
      set({ singleProduct: product });
    } catch (error) {
      console.error("Error fetching product:", error);
    }finally {
      set({ loading: false });
    }
  },
  setSingleProduct: (product) =>
    set((state) => ({
      singleProduct: {
        ...product,
        initialQuantity: product.initialQuantity ?? product.quantity, // добавим, если его нет
      },
    })),
  setSearchTerm: (term) => set({ searchTerm: term }),

  setProductQuantity: (productId, quantity) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, quantity } : p
      ),
    })),

  setProducts: (products) => set({ products }),

  getProductById: (id: number) =>
    get().products.find((product) => product.id === id),

  decreaseProductQuantity: (id, count) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              quantity: Math.max(0, p.quantity - count), // уменьшаем текущий остаток
            }
          : p
      ),
    })),

  increaseProductQuantity: (productId, count = 1) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              // увеличиваем остаток, но не выше initialQuantity
              quantity: Math.min(
                p.initialQuantity ?? Infinity,
                p.quantity + count
              ),
            }
          : p
      ),
    })),
}));
