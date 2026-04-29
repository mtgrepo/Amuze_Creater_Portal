import { AxiosError } from "axios"
import axiosInstance from "../../httpClient"

export interface NotificationParams {
    page: number
    limit: number
}

export const getAuthorNotifications = async (params: NotificationParams) => {
    try {
        const response = await axiosInstance.get(`author-notification/list`, { params });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const markNotificationAsRead = async (id:number) => {
    try {
        const response = await axiosInstance.put(`author-notification/${id}/read`);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const markAllNotificationAsRead = async (params: NotificationParams) => {    
    try {
        const response = await axiosInstance.put(`author-notification/read-all`, { params });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const getNotificationDetails = async (id: number) => {
    try {
        const response = await axiosInstance.get(`notification/get-notification-details/${id}`);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const markAsAllRead = async () => {
    try {
        const response = await axiosInstance.put(`notification/mark-all-read`);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}