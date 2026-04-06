import { AxiosError } from "axios"
import axiosInstance from "../../httpClient"

export const getAuthorReport = async (params: {authorId: number, startDate: string, endDate: string}) => {
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