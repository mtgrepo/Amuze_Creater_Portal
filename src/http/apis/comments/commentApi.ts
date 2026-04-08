
import axiosInstance from "@/http/httpClient";
import type { CommentResponseType, StoreCommentParams } from "@/types/response/comment/commentResponse";
import { AxiosError } from "axios"

export const deleteComment = async (
    type: string,
    commentId: number) => {
    try {
        const response = await axiosInstance.delete(`${type}/delete-comment/${commentId}`, { data: { commentId } });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed");
        }
        throw new Error((error as string) || "Something went wrong");
    }
}

export const getComments = async (
    type: string,
    contentId: number,
    page: number,
    pageSize: number): Promise<CommentResponseType> => {
    try {
        const routeType = type === "gallery" ? "get-all-comments" : "get-comments"
        const response = await axiosInstance.get(`${type}/${routeType}/${contentId}`, {
            params: {
                page, pageSize
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed");
        }
        throw new Error((error as string) || "Something went wrong");
    }
}


export const storeComments = async ({type, contentId, parentId, comment} : StoreCommentParams) => {
    try {
        const typeId = type === "novel" 
        ? "novelId" 
        : type === "comic" 
        ? "comicId" 
        : type === "story" 
        ? "storyId" 
        : type === "gallery" ? "galleryId" : "contentId";

        const payload = {
            [typeId] : contentId,
            parentId,
            comment
        }
        const response = await axiosInstance.post(`${type}/store-${type}-comment`, payload);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed");
        }
        throw new Error((error as string) || "Something went wrong");
    }
}