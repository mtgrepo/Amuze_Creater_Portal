import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios";

export const createMuseumEpisode = async (data: FormData) => {
  try {
    const response = await axiosInstance.post(
      "museum/store-museum-episode",
      data,
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

export const getMuseumEpisodeDetail = async (episodeId: number) => {
  try {
    const response = await axiosInstance.get(
      `museum/get-museum-episode/${episodeId}`,
    );
    return response.data.data;
  } catch (error) {
     if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const updateMuseumEpisodeThumbnail = async (
  episodeId: number,
  thumbnail: FormData,
) => {
  try {
    const response = await axiosInstance.put(
      `museum/update-museum-episode-thumbnail/${episodeId}`,
      thumbnail,
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

export const updateMuseumEpisode = async (
  episodeId: number,
  data: FormData,
) => {
  try {
    const response = await axiosInstance.put(
      `museum/update-museum-episode/${episodeId}`,
      data,
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

export const updateMuseumEpisodeFile = async (data: {
  episodeId: number;
  fileId: number;
  image?: File | null;
  label?: string;
  description?: string;
}) => {
  try {
    const formData = new FormData();
    formData.append("fileId", String(data.fileId));
    formData.append("label", data.label ?? "");
    formData.append("description", data.description ?? "");

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    const response = await axiosInstance.put(
      `museum/upate-file-museum-episode/${data.episodeId}`,
      formData,
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

export const museumEpisodeApprovalUpdate = async (episodeId: number, note?: string) => {
  try {
    const result = await axiosInstance.put(
      `museum/approve-or-unapprove-museum-episode/${episodeId}`,
      { note },
    );
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const museumEpisodePublishUpdate = async (episodeId: number, note?: string) => {
  try {
    const result = await axiosInstance.put(
      `museum/publish-or-ispublish-museum-episode/${episodeId}`,
      { note },
    );
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};