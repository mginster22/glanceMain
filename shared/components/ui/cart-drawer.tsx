"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "../libs";
import { Cart } from "../cart";
import { useCartStore } from "@/store/useCart";
import toast from "react-hot-toast";

interface Props {
  className?: string;
}

export const CartDrawer: React.FC<Props> = ({ className }) => {
  const { active, closeCart,cart, clearCart,loading } = useCartStore((state) => state);
  const drawerRef = useRef<HTMLDivElement>(null);

    const [loadingAll, setLoadingAll] = React.useState(loading);
  
  // Закрытие при клике вне корзины
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null; // Типизация для event.target
      if (
        drawerRef.current &&
        !drawerRef.current.contains(target) &&
        !(target && target.closest(".cart-item")) // Проверяем, что target существует
      ) {
        closeCart();
      }
    };

    if (active) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [active, closeCart]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0000007a] bg-opacity-40 flex justify-end">
      <div
        ref={drawerRef}
        className={cn(
          "cart-item w-[350px] h-full bg-white shadow-xl  overflow-y-auto transition-transform duration-300 ",
          className
        )}
      >
        <div className="flex items-center gap-10">
          <h2 className="text-xl font-bold mt-4 ml-5 cursor-pointer">Корзина</h2>
          <button
            onClick={async () => {
              try {
                setLoadingAll(true);
                await clearCart();
                setLoadingAll(false);
                toast.success("Корзина очищена");
              } catch (error) {
                console.log(error);
              }
            }}
            disabled={cart.length === 0}
            className="text-xl font-bold mt-4 select-none cursor-pointer ml-5 disabled:opacity-20"
          >
            Очистить
          </button>
        </div>
        <Cart loadingAll={loadingAll}/>
      </div>
    </div>
  );
};
