"use client";
import React from "react";
import toast from "react-hot-toast";
import { createOrder } from "../../services/order";
import { useCartStore } from "@/store/useCart";
import { useSession } from "next-auth/react";

interface Props {
  className?: string;
  totalAmount: number;
  setOrderId: (id: number) => void;
}

export const OrderBlock: React.FC<Props> = ({
  className,
  totalAmount,
  setOrderId,
}) => {
  const { cart, clearCart } = useCartStore((state) => state);
  const { data: session } = useSession(); // получаем данные сессии

  const handleOrder = async () => {
    const userId = Number(session?.user?.id);

    if (!userId) {
      toast.error("Вы не авторизованы");
      return;
    }

    try {
      const order = await createOrder({
        userId,
        total: totalAmount,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.count,
          price: item.price,
        })),
      });

      setOrderId(order.id); // ✅ сюда передаём id
      toast.success(`Заказ №${order.id} успешно оформлен`);
      clearCart();
    } catch (error) {
      toast.error("Ошибка при оформлении заказа");
    }
  };

  return (
    <div className="mt-auto border-t py-4 px-3">
      <h3 className="text-lg font-semibold">
        Общая сумма: <span className="text-gray-500">{totalAmount}грн</span>
      </h3>
      <button
        onClick={handleOrder}
        className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Оформить заказ
      </button>
    </div>
  );
};
