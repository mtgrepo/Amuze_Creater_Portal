import { updateThumbnail } from "@/http/apis/entertainment/comics/comicsTitleApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useComicsThumbnailUpdateCommand = () => {
  const qc = useQueryClient();
  const updateThumbnailMutation = useMutation({
    mutationKey: ["updateThumbnail"],
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const res = await updateThumbnail(data, id);
      // console.log("update res", res);
      return res?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comicsTitleList"] });
      qc.invalidateQueries({ queryKey: ["comicsTitleDetails"] });
      router.navigate(-1);
      toast.success(`Updated thumbnail successfully`);
    },
  });

  return {
    updateThumbnailMutation: updateThumbnailMutation.mutateAsync,
    isPending: updateThumbnailMutation?.isPending,
  };
};
