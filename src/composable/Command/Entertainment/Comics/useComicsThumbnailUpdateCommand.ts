import { updateThumbnail } from "@/http/apis/entertainment/comics/comicsTitleApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useComicsThumbnailUpdateCommand = () => {
  const qc = useQueryClient();
  const updateThumbnailMutation = useMutation({
    mutationKey: ["updateThumbnail"],
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const res = await updateThumbnail(data, id);
      console.log("update res", res);
      return res?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comicsTitleList"] });
      router.navigate("/entertainment/comics");
    },
  });

  return {
    updateThumbnailMutation: updateThumbnailMutation.mutateAsync,
    isPending: updateThumbnailMutation?.isPending,
  };
};
