import { AxiosError } from "axios"
import axiosInstance from "../../../httpClient"

export const deleteComment = async (commentId: number) => {
    try {
        const response = await axiosInstance.delete(`comic/delete-comment/${commentId}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Failed to delete comment")
        }
        throw new Error("An unexpected error occurred while deleting the comment")
    }
}

export const replyComment = async (comicId: number, parentId: number | null, comment: string) => {
    try {
        const response = await axiosInstance.post(`comic/store-comment`, {
            comicId,
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