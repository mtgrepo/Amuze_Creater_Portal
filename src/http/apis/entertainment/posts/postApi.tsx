import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios";

export interface PostParams {
  page: number;
  pageSize: number;
  is_banned?: boolean;
}

export const getAllPosts = async (userId: number, params: PostParams) => {
  try {
    const result = await axiosInstance.get(`post/get-all-posts`, {
      params: {
        userId,
        page: params.page,
        pageSize: params.pageSize,
        is_banned: params.is_banned,
      },
    });
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const getPostById = async (id: number) => {
  try {
    const result = await axiosInstance.get(`post/get-post-by-id/${id}`);
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const createPost = async (postData: FormData) => {
  try {
    const result = await axiosInstance.post(`post/create-post`, postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const updatePost = async (id: number, postData: FormData) => {
  try {
    const result = await axiosInstance.put(`post/update-post/${id}`, postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const updatePostMedia = async (id: number, mediaData: FormData) => {
  try {
    const result = await axiosInstance.put(
      `post/update-post-media/${id}`,
      mediaData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const deletePostMedia = async (id: number, indexId: number) => {
  try {
    const result = await axiosInstance.delete(
      `post/delete-post-image/${id}/${indexId}`,
    );
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

