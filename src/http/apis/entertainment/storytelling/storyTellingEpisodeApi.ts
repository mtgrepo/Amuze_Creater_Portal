import axiosInstance from "@/http/httpClient";
import type { UpdateStoryEpisodePayload } from "@/types/response/entertainment/storytelling/storytellingResponse";
import { AxiosError } from "axios";

export const createStoryTellingEpisode = async (episodeData: FormData) => {
  try {
    const response = await axiosInstance.post(`story/store-story-episode`, episodeData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error?.message || "Error occurred during creating new episode",
      );
    }
    throw new Error((error as string) || "Something went wrong");
  }
}

export const updateStoryTellingEpisode = async (episodeId: number, data: UpdateStoryEpisodePayload) => {
  try {
    const response = await axiosInstance.put(`story/update-story-episode/${episodeId}`, data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error?.message || "Error occurred during updating new episode",
      );
    }
    throw new Error((error as string) || "Something went wrong");
  }
}

export const updateStoryTellingEpisodeThumbnail = async (episodeId: number, thumbnail: FormData) => {
  try {
    const response = await axiosInstance.post(`story/update-story-episode-thumbnail/${episodeId}`, thumbnail,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error?.message || "Error occurred during updating episode thumbnail",
      );
    }
    throw new Error((error as string) || "Something went wrong");
  }
}

export const updateStoryTellingEpisodeAudio = async (episodeId: number, audio: FormData) => {
  try {
    const response = await axiosInstance.put(`story/update-story-episode-audio/${episodeId}`, audio,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error?.message || "Error occurred during updating episode audio",
      );
    }
    throw new Error((error as string) || "Something went wrong");
  }
}

export const generateStoryEpisodePresignedUrl = async (titleId: number, episodeName: string, contentType: string) => {
  try {
    const response = await axiosInstance.post("story/generate-story-episode-presigned-url", {
      titleId,
      episodeName,
      contentType,
    });
    return response.data as { status: boolean; message: string; data: { url: string; tempFilePath: string } };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error?.message || "Error occurred during updating episode audio",
      );
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const getStoryTellingEpisodeById = async (titleId: number,
  episodeId: number) => {
  try {
    const response = await axiosInstance.get(`story/get-story-episode`, {params: {titleId, episodeId}});
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error?.message || "Error occurred during retrieving episode details",
      );
    }
    throw new Error((error as string) || "Something went wrong");
  }
}