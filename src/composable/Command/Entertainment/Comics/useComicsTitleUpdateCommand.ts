import { updateTitle, type TitleProps } from "@/http/apis/entertainment/comics/comicsTitleApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useComicsTitleUpdateCommand = () => {
    const qc = useQueryClient();
    const updateTitleMutation = useMutation({
        mutationKey: ['updateTitle'],
        mutationFn: async ({id, data}: {id: string, data: TitleProps}) => {
            const res = await updateTitle(data, Number(id));
            console.log("update res", res);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['comicsTitleList']});
            router.navigate('/entertainment/comics');
            toast.success(`Updated title successfully`);
        }
    })

    return {
        updateTitleMutation: updateTitleMutation.mutateAsync,
        isPending: updateTitleMutation?.isPending,
    }
}