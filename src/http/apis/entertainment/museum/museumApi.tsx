import type { MuseumParams } from "@/composable/Query/Entertainment/Museum/useMuseumQuery";
import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios";

export const getAllMuseum = async (authorId: number, params: MuseumParams) => {
  try {
    const result = await axiosInstance.get(`museum/get-all-museum`, {
      params: {
       authorId,
       ...params
      },
    });
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const getMuseumById = async (id: number) => {
  try {
    const result = await axiosInstance.get(`museum/get-museum/${id}`);
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const createMuseum = async (museumData: FormData) => {
  try {
    const result = await axiosInstance.post(
      `museum/store-museum`,
      museumData,
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

export interface UpdateMuseumPayload {
    name: string;
    description: string;
}

export const updateMuseum = async (id:number, data: UpdateMuseumPayload) => {
  try {
    const result = await axiosInstance.put(
      `museum/update-museum/${id}`, data
    );
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const updateMuseumThumbnail = async (id:number, type: 'vertical' | 'horizontal', thumbnail:FormData) => {
  try {
    const result = await axiosInstance.put(
      `museum/update-museum-thumbnail/${id}?type=${type}`, thumbnail, {
      headers: {
         "Content-Type": "multipart/form-data",
      }
    }
    );
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const deleteMuseum = async (id:number) => {
  try {
    const result = await axiosInstance.delete(
      `museum/delete-museum/${id}`
    );
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};
