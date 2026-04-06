import { AxiosError } from "axios"
import axiosInstance from "../../httpClient"

export const getSubCategory = async () => {
    try {
        const response = await axiosInstance.get("subcategory/get-subcategories");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}