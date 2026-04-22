import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios";

export const updateSortingEpisode = async (type: string,episodeId: number, nextSorting: number) => {
  try {
    const response = await axiosInstance.put(`${type}/update-sorting/${episodeId}`,{
      nextSorting
    });
    return response?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error?.message || "Error occurred while updating sorting");
    }
    throw new Error((error as string) || "Something went wrong");
  }
}