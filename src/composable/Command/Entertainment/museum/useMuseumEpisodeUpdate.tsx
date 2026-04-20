import { updateMuseumEpisode } from "@/http/apis/entertainment/museum/museumEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const useMuseumEpisodeUpdate = () => {
  const queryClient = useQueryClient();
  const { id, museumId } = useParams();
  const navigate = useNavigate();
  const updateMutation = useMutation({
    mutationFn: async ({
      episodeId,
      data,
    }: {
      episodeId: number;
      data: FormData;
    }) => {
      return await updateMuseumEpisode(episodeId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["museumTitleDetail"] });
      toast.success(`Museum episode updated successfully`);
      navigate(`/entertainment/museum/${museumId}/title/details/${id}`, {
        replace: true,
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update episode");
    },
  });
  return {
    updateEpisodeMutation: updateMutation.mutateAsync,
    isUpdatePending: updateMutation.isPending,
  };
};
