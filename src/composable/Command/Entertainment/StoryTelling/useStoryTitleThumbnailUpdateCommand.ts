import { updateStoryTellingTitleThumbnail } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateThumbnailPayload = {
  id: number;
  type: 'vertical' | 'horizontal';
  thumbnail: FormData;
};

export const useStoryTellingTitleThumbnailUpdateCommand = () => {
  const queryClient = useQueryClient();

  const updateThumbnailMutation = useMutation({
    mutationKey: ["storyTellingTitleThumbnail"],
    mutationFn: async ({ id, type, thumbnail }: UpdateThumbnailPayload) => {
      return await updateStoryTellingTitleThumbnail(id, type, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyTellingTitleList"] });
    },
  });

  return {
    updateThumbnailMutation: updateThumbnailMutation.mutateAsync,
    isThumbnailUpdatePending: updateThumbnailMutation.isPending,
  };
};
