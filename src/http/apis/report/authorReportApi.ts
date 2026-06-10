import { AxiosError } from "axios"
import axiosInstance from "../../httpClient"

export interface AuthorReportParams {
    authorId: number,
    startDate?: string,
    endDate?: string
}

export const getAuthorReport = async (params: AuthorReportParams) => {
    try {
        const response = await axiosInstance.get(`report/get-author-report`, { params })
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(`Failed to fetch author report: ${error.message}`)
        }
        throw new Error(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export const getIncomeReport = async (params: {authorId: number, page: number, limit: number}) => {
    try {
        const response = await axiosInstance.get(`report/total-income`, {
            params
        })
        console.log("Total income response", response?.data)
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.response?.data?.message || "API failed!")
        }
        throw new Error (error as string || "Something went wrong!")
    }
}

export const getTotalFollowers = async (params: {authorId: number, page: number, limit: number}) => {
    try {
        const response = await axiosInstance.get(`report/followers`, {
            params
        })
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.response?.data?.message || "API Failed!")
        }
        throw new Error (error as string || "Something went wrong!")
    }
}

export const getTopContent = async (params: {type?: string}) => {
    try {   
        const response = await axiosInstance.get(`user/get-top-content`, {
            params: {
                type: params?.type
            }
        })
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.response?.data?.message || "API Failed");
        }
        throw new Error (error as string || "Something went wrong!")
    }
}

export const getStatusCount = async () => {
    try {
        const response = await axiosInstance.get(`user/get-author-dashboard-data`, )
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.response?.data?.message || "API Failed")
        }
        throw new Error (error as string || 'Something went wrong')
    }
}