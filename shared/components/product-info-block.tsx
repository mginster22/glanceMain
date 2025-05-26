"use client";

import React, { useEffect } from "react";
import { Button, Title } from "@/shared/components/ui";
import { Container } from "@/shared/components";
import { cn } from "@/shared/components/libs";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCart";
import { useProductStore } from "@/store/useProduct";
import { Loader2 } from "lucide-react";
import { ProductInfoBlockSkeleton } from "./ui/sceleton-product-info-block";
import { useSession } from "next-auth/react";
import { getColorByName } from "@/shared/components/libs";

interface Props {
  productId: number;
  className?: string;
}

interface Comment {
  id: number;
  text: string;
  user: {
    name: string;
    image: string;
  };
  createdAt: string;
}

export const ProductInfoBlock: React.FC<Props> = ({ productId, className }) => {
  const { addToCart, cart, loading } = useCartStore();
  const { singleProduct, fetchProductById } = useProductStore();

  const [comments, setComments] = React.useState<Comment[]>([]);
  const [value, setValue] = React.useState("");

  const { data: session } = useSession();

  useEffect(() => {
    fetchProductById(productId);
  }, [productId, fetchProductById, cart]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment?productId=${productId}`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [productId]);

  console.log(comments);

  if (!singleProduct) {
    return <ProductInfoBlockSkeleton className={className} />;
  }

  const availableQuantity = singleProduct.quantity ?? 0;

  return (
    <Container
      className={cn(
        "mt-4 flex flex-col max-sm:pb-40 max-sm:px-4 pb-8",
        className
      )}
    >
      <Title text="Карточка товара" size="md" />
      <div className="flex justify-between max-sm:flex-col max-sm:items-center">
        <img
          src={singleProduct.img[0]}
          alt={`${singleProduct.name} ${singleProduct.brand} ${singleProduct.model}`}
          className="w-[400px] h-[500px] object-contain max-sm:w-[200px] max-sm:h-[200px]"
        />
        <div className="w-[350px]">
          <p className="text-[32px] max-sm:text-[20px] flex flex-wrap gap-2">
            <span>{singleProduct.name}</span>
            <span>{singleProduct.brand}</span>
            <span>{singleProduct.model}</span>
            <span>{singleProduct.memory}</span>
          </p>
          <span className="font-light">Цвет белый</span>

          {singleProduct.characteristic && (
            <div className="flex flex-col text-xl max-sm:text-sm max-sm:gap-3 gap-9">
              <span className="text-2xl">Характеристики:</span>
              <p className="font-light">
                Экран: {singleProduct.characteristic.screen}
              </p>
              <p className="font-light">
                Количество ядер: {singleProduct.characteristic.cores}
              </p>
              <p className="font-light">
                Мощность блока питания: {singleProduct.characteristic.power}
              </p>
              <p className="font-light">
                Оперативная память (RAM): {singleProduct.characteristic.ram}
              </p>
              <p className="font-light">
                Встроенная память (ROM): {singleProduct.characteristic.rom}
              </p>
              <p className="font-light">
                Основная камера МПикс: {singleProduct.characteristic.camera}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col gap-4 items-center bg-[#E7E7ED]  w-[300px] max-h-[200px] py-8">
            <div className="flex items-end gap-2">
              {singleProduct.discount ? (
                <>
                  <span className="font-bold text-[20px]">
                    {Math.round(
                      singleProduct.price *
                        (1 - (singleProduct.discount ?? 0) / 100)
                    )}{" "}
                    грн
                  </span>
                  <span className="font-light text-[15px] line-through">
                    {singleProduct.price} грн
                  </span>
                </>
              ) : (
                <span className="font-bold text-[20px]">
                  {singleProduct.price} грн
                </span>
              )}
            </div>
            <Button
              className="..." // стили
              onClick={async () => {
                if (availableQuantity > 0) {
                  try {
                    await addToCart(singleProduct.id, 1);
                    toast.success("Товар добавлен в корзину");
                  } catch {
                    toast.error("Ошибка при добавлении в корзину");
                  }
                } else {
                  toast.error("Товара нет в наличии");
                }
              }}
              disabled={availableQuantity === 0 || loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5 mx-auto" />
              ) : (
                "В корзину"
              )}
            </Button>
            <div>
              {availableQuantity > 0 ? (
                <span className="text-[#169B00] text-[16px]">В наличии</span>
              ) : (
                <span className="text-red-400 text-[16px]">
                  Товар закончился
                </span>
              )}
            </div>
          </div>
          <div className="w-[300px]">
            <h3>Комментарии:</h3>
            <div className="flex flex-col gap-2 mt-4 ">
              {comments.map((comment, index) => {
                const isAuthor = session?.user?.name === comment.user.name;
                return (
                  <div key={comment.id} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {comment.user.image ? (
                        <img
                          src={comment.user.image}
                          className="w-[30px] h-[30px] rounded-full object-cover"
                          alt={comment.user.name}
                        />
                      ) : (
                        <div
                          className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{
                            backgroundColor: getColorByName(comment.user.name),
                          }}
                        >
                          {comment.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <p
                        title={comment.user.name}
                        className="max-w-[120px] truncate cursor-default"
                      >
                        {comment.user.name}
                      </p>
                      <p className="text-[10px] text-green-500 ">
                        {comment.createdAt}
                      </p>
                    </div>
                    <p className="text-[14px]">{comment.text}</p>
                    {isAuthor && (
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch("/api/comment", {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ commentId: comment.id }),
                            });

                            if (!res.ok) throw new Error("Ошибка удаления");

                            // Удаляем из стейта
                            setComments((prev) =>
                              prev.filter((c) => c.id !== comment.id)
                            );
                            toast.success("Комментарий удален");
                          } catch (err) {
                            console.error(err);
                            toast.error("Не удалось удалить комментарий");
                          }
                        }}
                        className="text-red-500 text-sm"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                );
              })}
              <div className="mt-8 flex flex-col gap-2">
                <span>Оставить комментарий:</span>
                <textarea
                  id="comment"
                  name="comment"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Напишите ваш комментарий..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-[150px] cursor-pointer"
                  onClick={async () => {
                    if (value.trim() === "") return;

                    if (!session) {
                      toast.error(
                        "Вы должны войти в аккаунт, чтобы оставить комментарий"
                      );
                      return;
                    }

                    const newComment = {
                      text: value,
                      productId,
                      user: {
                        name: session.user?.name ?? "Гость",
                        image: session.user?.image ?? "/default-avatar.png",
                      },
                    };

                    try {
                      const response = await fetch("/api/comment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newComment),
                      });

                      if (!response.ok)
                        throw new Error("Ошибка при отправке комментария");

                      const savedComment = await response.json();

                      setComments([savedComment, ...comments]);
                      setValue("");
                      toast.success("Комментарий добавлен!");
                    } catch (error) {
                      console.error(error);
                      toast.error("Ошибка при добавлении комментария");
                    }
                  }}
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
