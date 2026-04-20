import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios";
import type { UpdateMuseumPayload } from "./museumApi";

export const createMuseumTitle = async (titleData: FormData) => {
  try {
    const response = await axiosInstance.post(
      "museum/store-museum-title",
      titleData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
          throw new Error(error.response?.data.message || "API failed");
        }
        throw new Error((error as string) || "Something went wrong");
  }
};

export const updateMuseumTitle = async (titleId: number, data: UpdateMuseumPayload) => {
  try {
    const response = await axiosInstance.put(
      `museum/update-museum-title/${titleId}`,
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
          throw new Error(error.response?.data.message || "API failed");
        }
        throw new Error((error as string) || "Something went wrong");
  }
};

export const updateMuseumTitleThumbnail = async (
  titleId: number,
  thumbnail: FormData,
) => {
  try {
    const result = await axiosInstance.put(
      `museum/update-museum-title-thumbnail/${titleId}`,
      thumbnail,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
          throw new Error(error.response?.data.message || "API failed");
        }
        throw new Error((error as string) || "Something went wrong");
  }
};

export const getMuseumTitleDetail = async (id: number) => {
  try {
    const result = await axiosInstance.get(
      `museum/get-museum-title/${id}`,
    );
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
          throw new Error(error.response?.data.message || "API failed");
        }
        throw new Error((error as string) || "Something went wrong");
  }
};

