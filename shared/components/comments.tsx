"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { getColorByName } from "./libs";
import { useComment } from "../../store/useComment";

interface Props {
  className?: string;
  productId: number;
}



export const Comments: React.FC<Props> = ({ className, productId }) => {
  const { data: session } = useSession();

  const { comments, value, setValue, handleDelete, handleSubmit } = useComment({
    productId,
  });


  return (
    <div className={`w-[300px] ${className ?? ""}`}>
      <h3 className="text-lg font-semibold">Комментарии:</h3>

      <div className="flex flex-col gap-3 mt-4">
        {comments.map((comment) => {
          const isAuthor = session?.user?.email === comment.user.email;

          return (
            <div key={comment.id} className="flex flex-col gap-1 border-b pb-2">
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
                <p className="text-[10px] text-green-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>

              <p className="text-sm text-gray-500">{comment.text}</p>

              {isAuthor && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-500 text-xs self-start hover:underline"
                >
                  Удалить
                </button>
              )}
            </div>
          );
        })}

        <div className="mt-6 flex flex-col gap-2">
          <label htmlFor="comment" className="font-medium">
            Оставить комментарий:
          </label>
          <textarea
            id="comment"
            name="comment"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Напишите ваш комментарий..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          ></textarea>
          <button
            onClick={handleSubmit}
            className="bg-blue-900 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-[150px]"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};
