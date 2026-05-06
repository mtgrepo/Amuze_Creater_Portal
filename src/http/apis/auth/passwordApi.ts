import axiosInstance from "@/http/httpClient";
import type { OTPInput } from "@/types/input/auth/otpInput";
import type { ChangePasswordInput } from "@/types/input/auth/passwordInput";
import type { ResetPasswordInput } from "@/types/input/auth/resetPasswordInput";
import { AxiosError } from "axios"

export const changePassword = async (data: ChangePasswordInput) => {
    try {
        const response = await axiosInstance.put(`auth/change-password`, data);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data?.message || "API Failed!");
        }
        throw new Error(error as string || 'Something went wrong!')
    }
}

export const sendOTP = async (data: OTPInput) => {
    try {
        const response = await axiosInstance.post(`auth/send-otp`, data);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data?.message || "API Failed!");
        }
        throw new Error(error as string || 'Something went wrong!')
    }
}


export const resetPassword = async (data: ResetPasswordInput) => {
    try {
        const response = await axiosInstance.put(`auth/reset-password`, data);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error?.response?.data?.message || "API Failed!");
        }
        throw new Error(error as string || 'Something went wrong!')
    }
}
