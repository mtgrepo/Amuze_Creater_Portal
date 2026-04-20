import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios";

export const updateProfile = async (id: number, data: FormData) => {
  try {
    const response = await axiosInstance.put(
      `user/update-profile/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.message || "API Failed!");
    }
    throw new Error((error as string) || "Something went wrong!");
  }
};
