import { AxiosError } from "axios"
import axiosInstance from "../../../httpClient"

export interface PresignedUrlProps {
    contentType: string,
    seriesId: number,
    episodeName: string,
    parts: number
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

