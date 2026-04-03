import { AxiosError } from "axios";
import axiosInstance from "../../../httpClient";

export const getAllNovels = async ( params: { authorId: number, page: number; pageSize: number }) => {
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