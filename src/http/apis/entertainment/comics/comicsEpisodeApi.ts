import axiosInstance from "@/http/httpClient"
import { AxiosError } from "axios"

export const createComicsEpisode = async (data: FormData) => {
    try {
        const response = await axiosInstance.post('comic/store-comic-episode', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.message || "Error occurred during creating new episodes")
        }
        throw new Error (error as string || "Something went wrong")
    }
}