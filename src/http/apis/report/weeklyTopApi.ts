import axiosInstance from "@/http/httpClient"
import { AxiosError } from "axios"

export interface WeeklyTopContentResponse {
    id: number,
    title: string,
    category: string,
    thumbnail: string,
    likes:number,
    views: number,
    createdBy: string
}

export const getWeeklyTopContents = async () => {
    try {
        const response = await axiosInstance.get('user/get-weeekly-top-content');
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.response?.data?.message || "API Failed!")
        }
        throw new Error (error as string || "Something went wrong")
    }
}