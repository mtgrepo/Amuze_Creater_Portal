import {
  updateGalleryText,
  type GalleryTextInput,
} from "@/http/apis/entertainment/gallery/galleryApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGalleryUpdateTextCommand = () => {
  const qc = useQueryClient();
  const galleryUpdateTextMutation = useMutation({
    mutationKey: ["updateGalleryText"],
    mutationFn: async ({
      galleryId,
      data,
    }: {
      galleryId: number;
      data: GalleryTextInput;
    }) => {
      const res = await updateGalleryText(data, galleryId);
      return res?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["galleryList"] });
      toast.success("Gallery text content updated successfully");
    },
  });
  return {
    galleryUpdateTextMutation: galleryUpdateTextMutation?.mutateAsync,
    isUpdatingText: galleryUpdateTextMutation?.isPending,
  };
};
