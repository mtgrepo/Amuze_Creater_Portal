import axiosInstance from "@/http/httpClient"
import { AxiosError } from "axios"

export const getAllMainCategories = async () => {
    try {
        const response = await axiosInstance.get(`maincategory/get-main-category`);
        console.log("main category response", response?.data);
        return response?.data;
    } catch (error) {
        if(error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

