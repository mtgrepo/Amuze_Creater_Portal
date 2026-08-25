import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios";

export const getLiveGiftReport = async (page: number, pageSize: number) => {
    try {
        const params: any = { page, pageSize };
        const response = await axiosInstance.get(`live/gift/report/streamer`, {
            params,
        });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(`Failed to fetch author report: ${error.message}`);
        }
        throw new Error(
            `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
};