import { updateMuseumEpisodeFile } from "@/http/apis/entertainment/museum/museumApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const useMuseumEpisodeFileUpdate = () => {
  const queryClient = useQueryClient();
  const {titleId, episodeId} = useParams();
  const updateMutation = useMutation({
    mutationFn: async ({
      episodeId,
      data,
    }: {
      episodeId: number;
      data: FormData
    }) => {
      return await updateMuseumEpisodeFile(episodeId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["museumTitleDetail", titleId]});
      queryClient.invalidateQueries({queryKey: ["museumEpisodeDetail", episodeId]});
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update episode");
    },
  });
  return {
    updateEpisodeFileMutation: updateMutation.mutateAsync,
    isUpdateFilePending: updateMutation.isPending,
  };
};
