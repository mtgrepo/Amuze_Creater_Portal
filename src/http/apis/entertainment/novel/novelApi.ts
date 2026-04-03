import { AxiosError } from "axios";
import axiosInstance from "../../../httpClient";
import type { NovelUpdateInput } from "../../../../types/input/novel/novelUpdateInput";

export const getAllNovels = async ( params: { authorId: number, page: number; pageSize: number, name: string }) => {
    try {
        const response = await axiosInstance.get(`novel/get-all-novel`, { params})
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.message || "Error occurred while fetching novels");
        }
        throw new Error("Something went wrong!");
    }
}

export const createNovel = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(`novel/create-novel`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.message || "Error occurred while creating novel");
        }
        throw new Error("Something went wrong!");
    }
}

export const getNovelById = async (novelId: number) => {
    try {
        const response = await axiosInstance.get(`novel/get/${novelId}`);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.message || "Error occurred while fetching novel details");
        }
        throw new Error("Something went wrong!");
    }
}

export const updateNovelText = async (novelId: number, data: NovelUpdateInput) => {
    try {
        const response = await axiosInstance.put(`novel/update-novel/${novelId}`, data);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.message || "Error occurred while updating novel");
        }
        throw new Error("Something went wrong!");
    }
}

export const updateNovelThumbnail = async (novelId: number, type: string, thumbnail: FormData) => {
    try {
        const response = await axiosInstance.put(`novel/update-thumbnail/${type}/${novelId}`, thumbnail, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.message || "Error occurred while updating novel thumbnail");
        }
        throw new Error("Something went wrong!");
    }
}

export const updateNovelPdf = async (novelId: number, pdf: FormData) => {
    try {
        const response = await axiosInstance.put(`novel/update-novel-pdf/${novelId}`, pdf, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.message || "Error occurred while updating novel PDF");
        }
        throw new Error("Something went wrong!");
    }
}