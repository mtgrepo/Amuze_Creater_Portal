import { updateMuseumEpisodeThumbnail } from "@/http/apis/entertainment/museum/museumEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

type UpdateThumbnailPayload = {
  id: number;
  thumbnail: FormData;
};

export const useMuseumEpisodeThumbnailUpdate = () => {
  const queryClient = useQueryClient();
  const {titleId, episodeId} = useParams();

  const updateThumbnailMutation = useMutation({
    mutationFn: async ({ id, thumbnail }: UpdateThumbnailPayload) => {
      return await updateMuseumEpisodeThumbnail(id, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumTitleDetail", Number(titleId)] });
      queryClient.invalidateQueries({ queryKey: ["museumEpisodeDetail", Number(episodeId)] });
    },
  });

  return {
    updateThumbnailMutation: updateThumbnailMutation.mutateAsync,
    isThumbnailUpdatePending: updateThumbnailMutation.isPending,
  };
};
