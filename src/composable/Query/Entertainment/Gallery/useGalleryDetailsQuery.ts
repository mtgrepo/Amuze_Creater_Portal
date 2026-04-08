import { getGalleryById } from "@/http/apis/entertainment/gallery/galleryApi";
import { useQuery } from "@tanstack/react-query";

export const useGalleryDetailsQuery = (galleryId: number) => {
  const galleryDetails = useQuery({
    queryKey: ["galleryDetails", galleryId],
    queryFn: async () => {
      const res = await getGalleryById(galleryId);
      return res?.data;
    },
  });
  return {
    galleryDetails: galleryDetails?.data,
    isLoading: galleryDetails?.isLoading,
  };
};
