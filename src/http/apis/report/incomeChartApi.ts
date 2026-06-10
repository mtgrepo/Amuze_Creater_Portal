import axiosInstance from "@/http/httpClient"
import { AxiosError } from "axios"

export const getIncomeChartData = async () => {
    try {
        const response = await axiosInstance.get('user/get-income-chart');
        return response?.data;
    } catch (error) {
        if(error instanceof AxiosError) {
            throw new Error (error?.response?.data?.message || "API Failed")
        }
        throw new Error (error as string || "Something went wrong")
    }
}