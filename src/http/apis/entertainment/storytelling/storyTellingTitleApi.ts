import type { StoryTellingTitleParams } from "@/composable/Query/Entertainment/StoryTelling/useStoryTellingTitleQuery";
import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios";

export const getAllStoryTellingTitles = async (
  authorId: number,
  params: StoryTellingTitleParams,
) => {
  try {
    const response = await axiosInstance.get(`/story/get-all-story-titles`, {
      params: {
        authorId,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};

export const createStoryTellingTitle = async (titleData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `/story/store-story-title`,
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

export const getStoryTellingTitleById = async (storyId: number) => {
  try {
    const response = await axiosInstance.get(
      `/story/get-story-title/${storyId}`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
};
