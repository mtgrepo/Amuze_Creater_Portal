import type { StoryTellingTitleParams } from "@/composable/Query/Entertainment/StoryTelling/useStoryTellingTitleQuery";
import axiosInstance from "@/http/httpClient";
import type { UpdateStoryTitlePayload } from "@/types/response/entertainment/storytelling/storytellingResponse";
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

export const updateStoryTellingTitle = async (titleId: number, data: UpdateStoryTitlePayload) => {
  try{
    const response = await axiosInstance.put(`/story/update-story-title/${titleId}`, data);
    return response.data;
  }catch(error){
 if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
}

export const updateStoryTellingTitleThumbnail = async(titleId: number, type: 'vertical' | 'horizontal', formData : FormData) => {
  try{
    const response = await axiosInstance.put(`/story/update-story-title-thumbnail/${type}/${titleId}`, formData, {
      headers: {
         "Content-Type": "multipart/form-data",
      }
    });
    return response.data;
  }catch(error){
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
}

export const getStoryTellingTitleComment = async(titleId: number, page: number, pageSize:number) => {
  try{
    const response = await axiosInstance.get(`story/get-comments/${titleId}`, {
      params: {
        page,
        pageSize
      }
    });
    return response.data;
  }catch(error){
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "API failed");
    }
    throw new Error((error as string) || "Something went wrong");
  }
}

