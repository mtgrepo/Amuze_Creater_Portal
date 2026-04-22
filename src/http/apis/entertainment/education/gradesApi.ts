import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios"

export interface GradesParams {
    authorId: number
    approve_status?: number,
}
export const getAllGrades = async (params: GradesParams) => {
    try {
        const response = await axiosInstance.get(`education/get-all-grades`, {params});
        // console.log('grades', response?.data)
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error ( error?.response?.data?.message || "API failed");
        }
        throw new Error (error as string || "Something went wrong!")
    }
}

export const getGradeById = async (gradeId: number) => {
    try {
        const response = await axiosInstance.get(`education/get-grade-detail/${gradeId}`);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error ( error?.response?.data?.message || "API failed");
        }
        throw new Error (error as string || "Something went wrong!")
    }
}

export const createGrades = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(`education/store-grade`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error ( error?.response?.data?.message || "API failed");
        }
        throw new Error (error as string || "Something went wrong!")
    }
}

export const updateGradeText = async (gradeId: number, name: string) => {
    try {
        const response = await axiosInstance.put(`education/update-grade/${gradeId}`, {name});
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error ( error?.response?.data?.message || "API failed");
        }
        throw new Error (error as string || "Something went wrong!")
    }
}

export const updateGradeThumbnail = async (gradeId: number, data: FormData) => {
    try {
        const response = await axiosInstance.put(`education/update-grade-thumbnail/${gradeId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error ( error?.response?.data?.message || "API failed");
        }
        throw new Error (error as string || "Something went wrong!")
    }
}