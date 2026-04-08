import type { GalleryParams } from "@/composable/Query/Entertainment/Gallery/useGalleryQuery";
import axiosInstance from "@/http/httpClient"
import { AxiosError } from "axios"

export interface GalleryTextInput {
    name: string,
    description: string,
    price: number,
    generes: number[]
}
export const getAllGallery = async (authorId: number,params: GalleryParams) => {
    try {
        const response = await axiosInstance.get(`gallery/get-all-galleries?authorId=${authorId}`, { params })
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const createGallery = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(`gallery/create-gallery`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const updateGalleryText = async (data: GalleryTextInput, galleryId: number) => {
    try {
        const response = await axiosInstance.put(`gallery/update-gallery/${galleryId}`, data);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const getGalleryById = async (galleryId: number) => {
    try {
        const response = await axiosInstance.get(`gallery/get-galleryDetails/${galleryId}`);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const updateGalleryThumbnail = async ( galleryId: number, data: FormData) => {
    try {
        const response = await axiosInstance.put(`gallery/update-thumbnail/${galleryId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const getGalleryComments = async (galleryId: number) => {
    try {
        const response = await axiosInstance.get(`/gallery/get-comments/${galleryId}`, { 
            params: {
                page: 1,
                pageSize: 1000,
            },
         });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.message || "Error occurred while fetching gallery comments");
        }
        throw new Error("Something went wrong!");
    }
}