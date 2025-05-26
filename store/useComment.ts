import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { deleteComment, fetchComments, postComment } from "../services/comment";
import { toast } from "react-hot-toast";
import { Comment } from "../types/comments";

interface Props {
  productId: number;
}

export const useComment = ({productId}:Props) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(productId);
        setComments(data);
      } catch {
        toast.error("Не удалось загрузить комментарии");
      }
    };

    loadComments();
  }, [productId]);
  const handleSubmit = async () => {
    if (!session) {
      toast.error("Вы должны войти в аккаунт, чтобы оставить комментарий");
      return;
    }

    if (!value.trim()) return;

    try {
      const newComment = await postComment({ text: value, productId });
      setComments((prev) => [newComment, ...prev]);
      setValue("");
      toast.success("Комментарий добавлен!");
    } catch {
      toast.error("Не удалось отправить комментарий");
    }
  };
  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Комментарий удалён");
    } catch {
      toast.error("Не удалось удалить комментарий");
    }
  };
  return {
    comments,
    value,
    setValue,
    handleSubmit,
    handleDelete,
  };
};
