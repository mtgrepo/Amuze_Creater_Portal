import { createStoryTellingEpisode } from "@/http/apis/entertainment/storytelling/storyTellingEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useEpisodeCreateCommand = () => {
     const queryClient = useQueryClient();
     const navigate = useNavigate();
  const createEpisodeMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await createStoryTellingEpisode(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["storyTellingTitleDetails"]});
      queryClient.invalidateQueries({ queryKey: ["storyEpisodeDetails"] });
      toast.success(`Added new storytelling episode successfully`);
      navigate(-1)
    },
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to create episode");
    }
  });
    return{
        createEpisodeMutation: createEpisodeMutation.mutateAsync,
        isCreateEpisodePending: createEpisodeMutation.isPending
    }
}