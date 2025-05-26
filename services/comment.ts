import { axiosInstance } from "./instance";
import { Comment } from "@/types/comments";
interface NewComment {
  text: string;
  productId: number;
}

export const fetchComments = async (productId: number): Promise<Comment[]> => {
  const response = await axiosInstance.get<Comment[]>(`/comment?productId=${productId}`);
  return response.data;
};


export const postComment = async (comment: NewComment): Promise<Comment> => {
  const response = await axiosInstance.post<Comment>("/comment", comment);
  return response.data;
};

export const deleteComment = async (commentId: number) => {
  try {
    const response = await axiosInstance.request({
      url: "/comment",
      method: "DELETE",
      data: { commentId },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении комментария:", error);
    throw error;
  }
};
