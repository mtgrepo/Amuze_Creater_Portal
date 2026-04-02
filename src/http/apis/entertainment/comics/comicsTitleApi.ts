import type { ComicsTitleParams } from "@/composable/Query/Entertainment/Comics/useComicsTitleQuery";
import axiosInstance from "@/http/httpClient"
import { AxiosError } from "axios"

export interface TitleProps {
    name: string,
    description: string,
    genres: number[],
}

export const getAllComicsTitles = async (creatorId: number, params: ComicsTitleParams) => {
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

export const createComicsTitle = async (titleData: FormData) => {
    try {
        const response = await axiosInstance.post(`comic/store-comic-title`, titleData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.response?.data?.message || "Error occurred while creating comics title")
        }
        throw new Error ("Something went wrong!")
    }
}

export const comicsTitleById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`comic/get-comic-title/${String(id)}`);
        console.log("details", response?.data)
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.response?.data?.message || "Error occurred while fetching comics title details")
        }
        throw new Error ("Something went wrong!")
    }
}

export const updateTitle = async (data: TitleProps, id: number) => {
    try {
        const res = await axiosInstance.put(`comic/update-comic-title/${id}`, data);
        return res?.data
    } catch (error) {
        if  (error instanceof AxiosError) {
            throw new Error (error?.response?.data?.message || "Error occurred while updating title")
        }
        throw new Error ("Something went wrong!")
    }
}

export const updateThumbnail = async (data: FormData, id: number) => {
    try {
        const res = await axiosInstance.put(`comic/update-thumbnail/vertical/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return res?.data
    } catch (error) {
        if  (error instanceof AxiosError) {
            throw new Error (error?.response?.data?.message || "Error occurred while updating thumbnail")
        }
        throw new Error ("Something went wrong!")
    }
}