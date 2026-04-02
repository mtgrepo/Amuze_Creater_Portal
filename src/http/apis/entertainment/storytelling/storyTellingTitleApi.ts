import type { StoryTellingTitleParams } from "@/composable/Query/Entertainment/StoryTelling/useStoryTellingTitleQuery";
import axiosInstance from "@/http/httpClient";
import { AxiosError } from "axios";

export const getAllStoryTellingTitles = async (authorId: number, params: StoryTellingTitleParams) => {
    try {
        const response = await axiosInstance.get(`/story/get-all-story-titles`, {
            params: {
                authorId,
                ...params
            }
         });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message || "API failed")
        }
        throw new Error(error as string || "Something went wrong")
    }
}