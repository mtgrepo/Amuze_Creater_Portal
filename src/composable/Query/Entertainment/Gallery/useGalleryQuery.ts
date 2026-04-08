import { getAllGallery } from "@/http/apis/entertainment/gallery/galleryApi";
import { useQuery } from "@tanstack/react-query";

export interface GalleryParams {
  page: number;
  pageSize: number;
  approve_status?: number;
  is_published?: boolean;
  name?: string;
}

export const useGalleryQuery = (creatorId: number, params: GalleryParams) => {
  const galleryList = useQuery({
    queryKey: ["galleryList", creatorId, params],
    queryFn: async () => {
      const res = await getAllGallery(creatorId, params);
      // console.log("data in query", res?.data?.TotalPages)
      return res?.data;
    },
    enabled: !!creatorId && !!params,
  });
  return {
    galleryList: galleryList?.data?.galleries,
    isLoading: galleryList?.isLoading,
    totalPage: galleryList?.data?.TotalPages,
    total: galleryList?.data?.Total,
  };
};
