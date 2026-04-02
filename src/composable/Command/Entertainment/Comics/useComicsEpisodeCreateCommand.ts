import { createComicsEpisode } from "@/http/apis/entertainment/comics/comicsEpisodeApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useComicsEpisodeCreateCommand = () => {
  const queryClient = useQueryClient();
  const episodeMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createComicsEpisode(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comicsEpisodesList"] });
      toast.success(`Added new comics episode successfully`);
      router.navigate(-1);
    },
  });

  return {
    episodeMutation: episodeMutation.mutateAsync,
    isPending: episodeMutation?.isPending,
  };
};
