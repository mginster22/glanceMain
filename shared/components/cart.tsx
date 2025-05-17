"use client";
import React from "react";
import { cn } from "./libs";
import { Heart, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCart";
import { useProductStore } from "@/store/useProduct";

interface Props {
  className?: string;
}

export const Cart: React.FC<Props> = ({ className }) => {
  const { products } = useProductStore((state) => state);
  const { cart, deleteFromCart, updateCartItem } = useCartStore(
    (state) => state
  );
  const [loading, setLoading] = React.useState(false);
  const [loadingMap, setLoadingMap] = React.useState<Record<number, boolean>>(
    {}
  );
    const setItemLoading = (productId: number, isLoading: boolean) => {
    setLoadingMap((prev) => ({ ...prev, [productId]: isLoading }));
  };


  const [loadingAction, setLoadingAction] = React.useState<Record<number, "delete" | "plus" | "minus" | null>>({});
  
const setItemAction = (productId: number, action: "delete" | "plus" | "minus" | null) => {
  setLoadingAction((prev) => ({
    ...prev,
    [productId]: action,
  }));
};


  return (
    <div className={cn("flex flex-col gap-4 px-2", className)}>
      {cart.map((item) => {
        const productInStore = products.find((p) => p.id === item.productId);
        const currentCount = item.count ?? 0;
        // используем initialQuantity для сравнения
        const maxQuantity = productInStore?.initialQuantity ?? 0;
        const canIncrease = currentCount < maxQuantity;
      const currentAction = loadingAction[item.productId];
        return (
          <div
            key={item.productId}
            className="flex w-full border-t-1 py-4 items-center gap-4"
          >
            <img src={item.selectedImg} className="w-[75px]" alt={item.name} />
            <div className="flex flex-col items-start gap-2">
              <span>
                {item.name} {item.brand} {item.model}
              </span>
              <div className="flex items-center gap-3 mt-2">
                {item.discount ? (
                  <>
                    <span className="pointer-events-none select-none font-bold text-[20px]">
                      {Math.round(
                        item.price * (1 - (item.discount ?? 0) / 100)
                      )}{" "}
                      грн
                    </span>
                    <span className="pointer-events-none select-none font-light text-[15px] line-through">
                      {item.price} грн
                    </span>
                  </>
                ) : (
                  <span className="pointer-events-none select-none font-bold text-[20px]">
                    {item.price} грн
                  </span>
                )}
              </div>
              <div className="flex justify-between gap-6 items-center">
                <button className="p-2 bg-[#F6F6F6] rounded-md">
                  <Heart className="mx-auto" size={20} />
                </button>
                <button
                  onClick={async () => {
                    try {
                      setItemAction(item.productId, 'delete');
                      await deleteFromCart(item.productId);
                    } finally {
                      setItemAction(item.productId, null);
                    }
                  }}
                  className="p-2 bg-[#F6F6F6] rounded-md"
                >
                  {currentAction==='delete' ? (
                    <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                  ) : (
                    <Trash2 className="mx-auto" size={20} />
                  )}
                </button>
                <div className="border-1 border-[#750DC5] py-1 flex gap-2 justify-center items-center w-[110px]">
                  <button
                    disabled={currentCount <= 1}
                    className="text-[#750DC5] disabled:opacity-50"
                    onClick={async () => {
                      try {
                        setItemAction(item.productId, 'minus');
                        await updateCartItem(item.productId, currentCount - 1);
                      } finally {
                        setItemAction(item.productId, null);
                      }
                    }}
                  >
                    {currentAction === 'minus' ? (
                      <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                    ) : (
                      <Minus className="text-[#750DC5]" size={20} />
                    )}
                  </button>
                  <span className="mx-4">{currentCount}</span>
                  <button
                    disabled={!canIncrease}
                    className="text-[#750DC5] text-[20px] disabled:opacity-50"
                    onClick={async () => {
                      try {
                        setItemAction(item.productId, 'plus');
                        if (canIncrease) {
                          await updateCartItem(
                            item.productId,
                            currentCount + 1
                          );
                        } else {
                          toast.error("Нет в наличии");
                        }
                      } finally {
                        setItemAction(item.productId, null);
                      }
                    }}
                  >
                    {currentAction === 'plus' ? (
                      <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                    ) : (
                      <Plus />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
