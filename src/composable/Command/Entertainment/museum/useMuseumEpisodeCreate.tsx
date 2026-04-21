import { createMuseumEpisode } from "@/http/apis/entertainment/museum/museumEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const useMuseumEpisodeCreate = () => {
  const queryClient = useQueryClient();
    const { titleId,museumId } = useParams();
    const navigate = useNavigate();
  const episodeMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await createMuseumEpisode(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumTitleDetail"] });
      toast.success("Added new museum episode successfully");
      navigate(`/entertainment/museum/${museumId}/title/details/${titleId}`);
    },
    onError: (error:any) => {
      toast.error(error?.response?.data?.message || "Failed to create new museum episode");
    }
  });

  return {
    createMutation: episodeMutation.mutateAsync,
    isCreatePending: episodeMutation?.isPending,
  };
};
