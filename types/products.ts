export interface BaseProduct {
  id: number;
  brand: string;
  model: string;
  memory: string;
  img: string[];
  price: number;
  discount?: number | null;
  newModel?: boolean;
  quantity: number;
  name: string;
  initialQuantity?: number;
  characteristic?: {
    screen: string;
    cores: string;
    power: string;
    ram: string;
    rom: string;
    camera: string;
  };
}

export interface ProductItem extends BaseProduct {}

export interface FavoriteItems extends BaseProduct {}

export interface CartItem extends BaseProduct {
  productId: number;
  selectedImg: string;
  count: number; // количество в корзине
}
