"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "../libs";
import { Cart } from "../cart";
import { useCartStore } from "@/store/useCart";
import toast from "react-hot-toast";
import { OrderBlock } from "../order-block";

interface Props {
  className?: string;
}

export const CartDrawer: React.FC<Props> = ({ className }) => {
  const [orderId, setOrderId] = React.useState<number | null>(null);
  const { active, closeCart, cart, clearCart, loading } = useCartStore(
    (state) => state
  );
  const drawerRef = useRef<HTMLDivElement>(null);

  const [loadingAll, setLoadingAll] = React.useState(loading);

  const totalAmount =
    Math.round(
      cart.reduce((sum, item) => {
        const price = item.price ?? 0;
        const count = item.count ?? 1;
        const discount = item.discount ?? 0;

        const discountedPrice = price - (price * discount) / 100;
        return sum + discountedPrice * count;
      }, 0) / 1
    ) * 1;

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
          "cart-item w-[350px] h-full bg-white shadow-xl  overflow-y-auto transition-transform duration-300 flex flex-col",
          className
        )}
      >
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="flex items-center gap-10">
            <h2 className="text-xl font-bold mt-4 ml-5 cursor-pointer">
              Корзина
            </h2>
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

          {cart.length === 0 && !orderId ? (
            <div className="flex justify-center items-center h-full">
              <h3 className="text-lg font-semibold">Корзина пуста</h3>
            </div>
          ) : orderId ? (
            <div className="flex justify-center items-center h-full">
              <h3 className="text-lg font-semibold">
                Заказ №{orderId} успешно оформлен
              </h3>
            </div>
          ) : (
            <>
              <Cart loadingAll={loadingAll} />
              <OrderBlock totalAmount={totalAmount} setOrderId={setOrderId} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
