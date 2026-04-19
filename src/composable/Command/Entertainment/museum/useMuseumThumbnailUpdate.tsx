import { updateMuseumThumbnail } from "@/http/apis/entertainment/museum/museumApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateThumbnailPayload = {
  id: number;
  type: "vertical" | "horizontal";
  thumbnail: FormData;
};

export const useMuseumThumbnailUpdate = () => {
  const queryClient = useQueryClient();

  const updateThumbnailMutation = useMutation({
    mutationKey: ["museumThumbnail"],
    mutationFn: async ({ id, type, thumbnail }: UpdateThumbnailPayload) => {
      return await updateMuseumThumbnail(id, type, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumDetail"] });
    },
  });

  return {
    updateThumbnailMutation: updateThumbnailMutation.mutateAsync,
    isThumbnailUpdatePending: updateThumbnailMutation.isPending,
  };
};
