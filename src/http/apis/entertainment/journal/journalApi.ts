import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios"

export const getAllJournals = async (params: { authorId: number, page: number; pageSize: number }) => {
    try {
        const response = await axiosInstance.get(`magazine/get-all-magazines`, { params })
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}