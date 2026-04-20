import { updateEpisodeThumbnail } from "@/http/apis/entertainment/comics/comicsEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useComicEpisodeThumbnailUpdateCommand = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const episodeThumbnailMutation = useMutation({
    mutationKey: ["updateEpisode"],
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const res = await updateEpisodeThumbnail(id, data);
      // console.log("up ep", res);
      return res?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comicsEpisodesList"] });
      qc.invalidateQueries({ queryKey: ["comicsTitleDetails"] });
      toast.success("Comics episode update successfully");
      navigate(-1);
    },
  });
  return {
    episodeThumbnailMutation: episodeThumbnailMutation?.mutateAsync,
    isPending: episodeThumbnailMutation?.isPending,
  };
};
