import { createMuzeBoxEpisode } from "@/http/apis/entertainment/muzeBox/muzeBoxEpisodeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useMuzeBoxEpisodeCreateCommand = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const episodeCreateMutation = useMutation({
        mutationKey: ['createMuzeBoxEpisode'],
        mutationFn: async (data: FormData) => {
            const res = await createMuzeBoxEpisode(data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['muzeBoxList'] });
            qc.invalidateQueries({ queryKey: ['muzeBoxTitleDetails'] });
            toast.success("MuzeBox episode create successfully");
            navigate(-1);
        }
    })

    return {
        episodeCreateMutation: episodeCreateMutation?.mutateAsync,
        isPending: episodeCreateMutation?.isPending
    }
}