import { updateThumbnail } from "@/http/apis/entertainment/comics/comicsTitleApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useComicsThumbnailUpdateCommand = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const updateThumbnailMutation = useMutation({
    mutationKey: ["updateThumbnail"],
    mutationFn: async ({ id, type, data }: { id: number; type: string; data: FormData }) => {
      const res = await updateThumbnail(id, type, data);
      // console.log("update res", res);
      return res?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comicsTitleList"] });
      qc.invalidateQueries({ queryKey: ["comicsTitleDetails"] });
      navigate(-1);
      toast.success(`Updated thumbnail successfully`);
    },
  });

  return {
    updateThumbnailMutation: updateThumbnailMutation.mutateAsync,
    isPending: updateThumbnailMutation?.isPending,
  };
};
