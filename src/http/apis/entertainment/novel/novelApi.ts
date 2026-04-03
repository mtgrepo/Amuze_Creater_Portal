import { AxiosError } from "axios";
import axiosInstance from "../../../httpClient";

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