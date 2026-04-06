import { updateStoryTellingTitleThumbnail } from "@/http/apis/entertainment/storytelling/storyTellingTitleApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("Updated storytelling title thumbnail successfully");
      router.navigate("/entertainment/storytelling");
    },
  });

  return {
    updateThumbnailMutation: updateThumbnailMutation.mutateAsync,
    isThumbnailUpdatePending: updateThumbnailMutation.isPending,
  };
};
