import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios";

export const getAllComments = async (category: string ,id: number) => {
  try {
    let route = "get-comments";
    if (category === "gallery") {
      route = "get-all-comments"
    }
    const response = await axiosInstance.get(`${category}/${route}/${id}`, {
      params: {
        page: 1,
        pageSize: 1000,
      },
    });
    return response?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error?.response?.data?.message ||
          "Error occurred while fetching comments",
      );
    }
    throw new Error("Something went wrong!");
  }
};

export const deleteComment = async ( category: string, commentId: number) => {
    try {
        const response = await axiosInstance.delete(`${category}/delete-comment/${commentId}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to delete comment")
        }
        throw new Error("An unexpected error occurred while deleting the comment")
    }
}

export const replyComment = async ( category: string, id: number, parentId: number | null, comment: string) => {
    try {
      let categoryId = category;
      if (category === "muze-box") {
        categoryId = "series"
      }
        const response = await axiosInstance.post(`${category}/store-comment`, {
            [`${categoryId}Id`]: id,
            parentId,
            comment
        })
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to reply to comment")
        }
        throw new Error("An unexpected error occurred while replying to the comment")
    }
}