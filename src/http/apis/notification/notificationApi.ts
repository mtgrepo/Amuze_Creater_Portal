import { AxiosError } from "axios"
import axiosInstance from "../../httpClient"

export interface NotificationParams {
    page: number
    pageSize: number
    userId: number
    role_id: number
    is_read: boolean
}

export const getAllNotifications = async (params: NotificationParams) => {
    try {
        const response = await axiosInstance.get(`notification/get-all-notifications`, { params });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}