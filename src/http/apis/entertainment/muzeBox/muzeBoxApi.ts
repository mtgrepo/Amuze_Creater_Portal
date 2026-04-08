import axiosInstance from "@/http/httpClient"
import { AxiosError } from "axios"

export interface MuzeBoxParams {
    authorId: number,
    page: number,
    pageSize: number,
    approve_status?: number,
    is_published?: boolean,
    name?: string
}
 export interface MuzeBoxTextInput {
    name: string,
    description: string,
    genres: number[]
 }
export const getAllMuzeBox = async ( params: MuzeBoxParams) => {
    try {
        const response = await axiosInstance.get(`muze-box/get-all-muze-box-series`, {params});
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}

export const getMuzeBoxById = async (muzeBoxId: number) => {
    try {
        const response = await axiosInstance.get(`muze-box/get-muze-box-series/${muzeBoxId}`);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error ( error.response?.data.message || "API failed");
        }
        throw new Error (error as string ||  "Something went wrong")
    }
}

export const createMuzeBox = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(`muze-box`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error.response?.data.message || "API failed")
        }
        throw new Error (error as string || "Something went wrong")
    }
}

export const updateMuzeBoxText = async (muzeBoxId: number, data: MuzeBoxTextInput) => {
    try {
        const response = await axiosInstance.put(`muze-box/update-muze-box-series/${muzeBoxId}`, data);
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error.response?.data.message || "API failed")
        }
        throw new Error (error as string || "Something went wrong")
    }
}

export const updateMuzeBoxThumbnail = async (muzeBoxId: number, type: string, data: FormData) => {
    try {
        const response = await axiosInstance.put(`muze-box/update-thumbnail/${type}/${muzeBoxId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error.response?.data.message || "API failed")
        }
        throw new Error (error as string || "Something went wrong")
    }
}

