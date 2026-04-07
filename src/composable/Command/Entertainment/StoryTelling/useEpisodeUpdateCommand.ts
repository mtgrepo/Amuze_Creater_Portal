import { updateStoryTellingEpisode } from "@/http/apis/entertainment/storytelling/storyTellingEpisodeApi";
import router from "@/router/routes";
import type { UpdateStoryEpisodePayload } from "@/types/response/entertainment/storytelling/storytellingResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const useEpisodeUpdateCommand = () => {
     const queryClient = useQueryClient();
     const {titleId} = useParams();
  const updateEpisodeMutation = useMutation({
    mutationFn: async ({episodeId, data}:{episodeId:number, data: UpdateStoryEpisodePayload}) => {
      await updateStoryTellingEpisode(episodeId , data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyTellingTitleList"] });
      queryClient.invalidateQueries({queryKey: ['storyTellingTitleDetails']})
      router.navigate(`/entertainment/storytelling/details/${titleId}`);
    },
     onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to update episode");
    }
  });
    return{
        updateEpisodeMutation: updateEpisodeMutation.mutateAsync,
        isUpdateEpisodePending: updateEpisodeMutation.isPending
    }
}