import { updateStoryTellingEpisodeThumbnail } from "@/http/apis/entertainment/storytelling/storyTellingEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEpisodeThumbnailUpdateCommand = () => {
     const queryClient = useQueryClient();
  const updateEpisodeThumbnailMutation = useMutation({
    mutationFn: async ({episodeId, thumbnail}:{episodeId:number, thumbnail:FormData}) => {
      await updateStoryTellingEpisodeThumbnail(episodeId , thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyTellingTitleList"] });
      queryClient.invalidateQueries({queryKey: ['storyTellingTitleDetails']})
    },
  });
    return{
        updateEpisodeThumbnailMutation: updateEpisodeThumbnailMutation.mutateAsync,
        isUpdateEpisodeThumbnailPending: updateEpisodeThumbnailMutation.isPending
    }
}