import { updateSortingEpisode } from "@/http/apis/sorting/sortingApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useEpisodeSortingCommand = () => {
    const qc = useQueryClient();
    
    const updateSortingMutation = useMutation({
        mutationKey: ["updateComicEpisodeSorting"],
        mutationFn: async ({type,episodeId, nextSorting}: {type: string, episodeId: number, nextSorting: number}) => {
            const res = await updateSortingEpisode(type,episodeId, nextSorting);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['comicsTitleDetails']});
            toast.success(`Update sorting successfully`);
        }
    })
    return {
        updateSortingMutation: updateSortingMutation.mutateAsync,
        isPending: updateSortingMutation?.isPending
    }
}