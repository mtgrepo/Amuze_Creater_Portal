import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios";

export const createComicsEpisode = async (data: FormData) => {
  try {
    const response = await axiosInstance.post(
      "comic/store-comic-episode",
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
      throw new Error(
        error?.message || "Error occurred during creating new episodes",
      );
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const getComicEpisodeById = async (
  titleId: number,
  episodeId: number,
) => {
  try {
    const response = await axiosInstance.get(
      `comic/get-comic-episode?titleId=${titleId}&episodeId=${episodeId}`,
    );
    console.log("e data", response?.data);
    return response?.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error?.message || "Error occurred while retrieving episodes",
      );
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const updateComicEpisode = async (id: number, data: FormData) => {
  try {
    const response = await axiosInstance.put(
      `comic/update-episode/${id}`,
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
      throw new Error(
        error?.message || "Error occurred while update comic episode",
      );
    }
    throw new Error((error as string) || "Something  went wrong");
  }
};

export const updateEpisodeThumbnail = async (id: number,data: FormData) => {
    try {
        const response = await axiosInstance.put(`comic/update-episode-thumbnail/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.message || "Error occurred while update thumbnail")
        }
        throw new Error (error as string || "Something went wrong")
    }
}

export const deleteEpisodeImage = async (episodeId: number, imageId: number) => {
    try {
        const response = await axiosInstance.delete(`comic/delete-episode-image/${episodeId}/${imageId}`);
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error (error?.message || "Error occurred while deleting episode image");
        }
        throw new Error (error as string || "Something went wrong")
    }
}
