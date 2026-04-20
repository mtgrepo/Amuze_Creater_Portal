import { createComicsEpisode } from "@/http/apis/entertainment/comics/comicsEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useComicsEpisodeCreateCommand = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const episodeMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createComicsEpisode(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comicsEpisodesList"] });
      queryClient.invalidateQueries({ queryKey: ["comicsTitleDetails"] });
      toast.success(`Added new comics episode successfully`);
      navigate(-1);
    },
  });

  return {
    episodeMutation: episodeMutation.mutateAsync,
    isPending: episodeMutation?.isPending,
  };
};
