import { updateMuseumTitleThumbnail } from "@/http/apis/entertainment/museum/museumTitleApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateThumbnailPayload = {
  id: number;
  thumbnail: FormData;
};

export const useMuseumTitleThumbnailUpdate = () => {
  const queryClient = useQueryClient();

  const updateThumbnailMutation = useMutation({
    mutationFn: async ({ id, thumbnail }: UpdateThumbnailPayload) => {
      return await updateMuseumTitleThumbnail(id, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumTitleDetail"] });
    },
  });

  return {
    updateTitleThumbnailMutation: updateThumbnailMutation.mutateAsync,
    isThumbnailUpdatePending: updateThumbnailMutation.isPending,
  };
};
