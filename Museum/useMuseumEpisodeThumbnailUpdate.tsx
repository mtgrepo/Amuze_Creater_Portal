import { updateMuseumEpisodeThumbnail } from "@/http/apis/entertainment/museum/museumEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateThumbnailPayload = {
  id: number;
  thumbnail: FormData;
};

export const useMuseumEpisodeThumbnailUpdate = () => {
  const queryClient = useQueryClient();

  const updateThumbnailMutation = useMutation({
    mutationFn: async ({ id, thumbnail }: UpdateThumbnailPayload) => {
      return await updateMuseumEpisodeThumbnail(id, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumEpisodeDetail"] });
    },
  });

  return {
    updateThumbnailMutation: updateThumbnailMutation.mutateAsync,
    isThumbnailUpdatePending: updateThumbnailMutation.isPending,
  };
};
