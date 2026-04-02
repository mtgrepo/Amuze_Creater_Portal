import { comicsTitleById } from "@/http/apis/entertainment/comics/comicsTitleApi";
import type { ComicsTitleDetailsResponse } from "@/types/response/entertainment/comics/comicsTitleDetailsResponse";
import { useQuery } from "@tanstack/react-query";

export interface DetailsParams {
  id: string;
  roleId: number;
  userId: number;
}
export const useComicsTitleDetailsQuery = (data: DetailsParams) => {
  const titleDetails = useQuery<ComicsTitleDetailsResponse>({
    queryKey: ["comicsTitleDetails", data?.id],
    queryFn: async () => {
      const res = await comicsTitleById(data);
    //   console.log("data in qu", res);
      return res?.data;
    },
    enabled: !!data?.id,
  });
  return {
    titleDetails: titleDetails.data,
    isLoading: titleDetails.isLoading,
    error: titleDetails.error,
  };
};
