import axiosInstance from "@/http/httpClient"
import { AxiosError } from "axios"

export interface GenreResponse {
    id: number,
    uuid: string,
    name: string,
    name_eng: string,
    sub_category_id: number,
    color: string,
    sub_category: {
        id: number,
        name: string
    }
}

export const getAllGenres = async () => {
    try {
        const response = await axiosInstance.get(`genere/get-sub-generes?subcategory_id=${1}`)
        return response?.data?.data;
    } catch (error) {
        if( error instanceof AxiosError ) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}