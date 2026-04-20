import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios"

export interface GradesParams {
    authorId: number
}
export const getAllGrades = async (params: GradesParams) => {
    try {
        const response = await axiosInstance.get(`education/gat-all-grades`, {params});
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error ( error?.response?.data?.message || "API failed");
        }
        throw new Error (error as string || "Something went wrong!")
    }
}