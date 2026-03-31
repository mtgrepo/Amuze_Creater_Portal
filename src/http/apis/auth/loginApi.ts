import axiosInstance from "@/http/httpClient";
import type { LoginInput } from "@/types/input/auth/loginInput";
import { AxiosError } from "axios"

export const creatorLogin = async (data: LoginInput) => {
    try {
        const response = await axiosInstance.post(`auth/login`, data);
        console.log("login response", response?.data);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error.response?.data.message || "API failed");
        }
        throw new Error( error as string || "Something went wrong");
    }
}