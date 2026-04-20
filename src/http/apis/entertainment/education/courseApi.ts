import { AxiosError } from "axios"
import axiosInstance from "../../../httpClient";

export const getCourseById = async (courseId: number) => {
    try {
        const response = await axiosInstance.get(`education/get-course/${courseId}`);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error ( error?.response?.data?.message || "API failed");
        }
        throw new Error (error as string || "Something went wrong!")
    }
}

export const createCourse = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(`education/store-course`, data, {
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

export const updateCourseText = async (courseId: number, name: string, price: number, grade_id: number) => {
    try {
        const response = await axiosInstance.put(`education/update-course/${courseId}`, {name, price, grade_id});
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error ( error?.response?.data?.message || "API failed");
        }
        throw new Error (error as string || "Something went wrong!")
    }
}

export const updateCourseThumbnail = async (courseId: number, data: FormData) => {
    try {
        const response = await axiosInstance.put(`education/update-course-thumbnail/${courseId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error ( error?.response?.data?.message || "API failed");
        }
        throw new Error (error as string || "Something went wrong!")
    }
}

export const updateCoursePDF = async (courseId: number, data: FormData) => {
    try {
        const response = await axiosInstance.put(`education/update-course-pdf/${courseId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response?.data
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error ( error?.response?.data?.message || "API failed");
        }
        throw new Error (error as string || "Something went wrong!")
    }
}