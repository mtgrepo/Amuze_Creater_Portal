import axiosInstance from "@/http/httpClient"
import { AxiosError } from "axios"


export const getPopularByCategory = async (category: string) => {
    try {
        let subcategory = category;
        if (category === 'muze-box'){
            subcategory = 'series'
        } else if (category === 'storytelling') {
            category = 'story'
            subcategory = 'story'
        }
        const response = await axiosInstance.get(`/${category}/get-popular-${subcategory}`)
        console.log("POpular response", response?.data);
        return response?.data
    } catch (error) {
        if(error instanceof AxiosError) {
            throw new Error (error?.response?.data?.message || "API Failed!")
        }
        throw new Error ((error as string) || "Something went wrong!")
    }
}