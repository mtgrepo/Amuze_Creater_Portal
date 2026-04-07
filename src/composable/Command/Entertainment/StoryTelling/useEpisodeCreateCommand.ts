import { createStoryTellingEpisode } from "@/http/apis/entertainment/storytelling/storyTellingEpisodeApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const useEpisodeCreateCommand = () => {
     const queryClient = useQueryClient();
     const {id} = useParams();
  const createEpisodeMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await createStoryTellingEpisode(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyTellingTitleList"] });
      toast.success(`Added new storytelling episode successfully`);
      router.navigate(`/entertainment/storytelling/details/${id}`)
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