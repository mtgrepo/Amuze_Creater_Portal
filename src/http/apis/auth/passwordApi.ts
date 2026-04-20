import axiosInstance from "@/http/httpClient";
import type { ChangePasswordInput } from "@/types/input/auth/passwordInput";
import { AxiosError } from "axios"

export const changePassword = async (data: ChangePasswordInput) =>  {
    try {
        const response = await axiosInstance.put(`auth/change-password`, data);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            // console.log("error ", error?.response?.data?.message)
            throw new Error (error?.response?.data?.message || "API Failed!");
        }
        throw new Error (error as string || 'Something went wrong!')
    }
}