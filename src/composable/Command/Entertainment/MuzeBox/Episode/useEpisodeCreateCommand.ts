import { createMuzeBoxEpisode } from "@/http/apis/entertainment/muzeBox/muzeBoxEpisodeApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useMuzeBoxEpisodeCreateCommand = () => {
    const qc = useQueryClient();

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
            router.navigate(-1);
        }
    })

    return {
        episodeCreateMutation: episodeCreateMutation?.mutateAsync,
        isPending: episodeCreateMutation?.isPending
    }
}