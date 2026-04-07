import { updateStoryTellingEpisodeAudio} from "@/http/apis/entertainment/storytelling/storyTellingEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEpisodeAudioUpdateCommand = () => {
     const queryClient = useQueryClient();
  const updateEpisodeAudioMutation = useMutation({
    mutationFn: async ({episodeId, audio}:{episodeId:number, audio:FormData}) => {
      await updateStoryTellingEpisodeAudio(episodeId , audio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyTellingTitleList"] });
      queryClient.invalidateQueries({queryKey: ['storyTellingTitleDetails']})
    },
  });
    return{
       updateEpisodeAudioMutation: updateEpisodeAudioMutation.mutateAsync,
        isUpdateEpisodeAudioPending: updateEpisodeAudioMutation.isPending
    }
}