import type { ComicsTitleParams } from "@/composable/Query/Entertainment/Comics/useComicsTitleQuery";
import axiosInstance from "@/http/httpClient"
import { AxiosError } from "axios"

export const getAllComicsTitles = async (creatorId: string, params: ComicsTitleParams) => {
    try {
        const response = await axiosInstance.get(`comic/get-all-comic-titles?authorId=${creatorId}`, {params});
        // console.log("comics title response", response?.data?.data);
        return response?.data;
    } catch (error) {
        if(error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}