import { deleteMuseumEpisodeFile } from "@/http/apis/entertainment/museum/museumApi";
import { useMutation } from "@tanstack/react-query";

export const useMuseumEpisodeFileDelete = () => {
  const deleteMutation = useMutation({
    mutationFn: async ({
      episodeId,
      fileId,
    }: {
      episodeId: number;
      fileId: number;
    }) => {
      return await deleteMuseumEpisodeFile(episodeId, fileId);
    },
  });
  return {
    deleteEpisodeFileMutation: deleteMutation.mutateAsync,
    isDeleteFilePending: deleteMutation.isPending,
  };
};
