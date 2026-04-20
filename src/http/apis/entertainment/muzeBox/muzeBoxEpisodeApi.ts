import { AxiosError } from "axios"
import axiosInstance from "../../../httpClient"

export interface PresignedUrlProps {
    contentType: string,
    seriesId: number,
    episodeName: string,
    parts: number
}

export interface EpisodeTextInput {
    name: string,
    description: string,
    series_id?: number,
    price: number
}

export const getPresignedUploadUrl = async (data: PresignedUrlProps) => {
    try {
        const response = await axiosInstance.post(`muze-box/generate-presigned-upload-url`, data);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const uploadMultipart = async () => {
    try {
        const response = await axiosInstance.post(`muze-box/upload-multipart`);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const getMuzeBoxEpisodeById = async (seriesId: number, episodeId: number) => {
    try {
        const response = await axiosInstance.get(`muze-box/get-muze-box-episode`, { params: {  seriesId, episodeId } });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}
export const createMuzeBoxEpisode = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(`muze-box/portal/store-muze-box-episode`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const updateMuzeBoxEpisodeText = async (episodeId: number, data: EpisodeTextInput) => {
    try {
        const response = await axiosInstance.put(`muze-box/update-episode/${episodeId}`, data);
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const updateMuzeBoxEpisodeThumbnail = async (episodeId: number, data: FormData) => {
    try {
        const response = await axiosInstance.put(`muze-box/update-episode-thumbnail/${episodeId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const updateMuzeBoxEpisodeVideo = async (episodeId: number, data: FormData) => {
    try {
        const response = await axiosInstance.put(`muze-box/update-episode-video/${episodeId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

