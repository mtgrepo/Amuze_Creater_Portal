import { AxiosError } from "axios"
import axiosInstance from "../../httpClient"

export interface PruchaseReportParams {
    page: number
    pageSize: number
    subCategoryId: number
    authorId: number
    startDate: string
    endDate: string
    purchaseBy: string
    userId: string
}

export const getPurchaseReport = async (params: PruchaseReportParams) => {
    try {
        const response = await axiosInstance.get(`report/get-purchase-report`, { params });
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}