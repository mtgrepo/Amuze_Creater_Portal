import { updateComicEpisode } from "@/http/apis/entertainment/comics/comicsEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useComicEpisodeUpdateCommand = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const episodeMutation = useMutation({
    mutationKey: ["updateEpisode"],
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const res = await updateComicEpisode(id, data);
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
    episodeMutation: episodeMutation?.mutateAsync,
    isPending: episodeMutation?.isPending,
  };
};
