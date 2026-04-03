import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { NovelUpdateInput } from "../../../../types/input/novel/novelUpdateInput";
import { updateNovelText } from "../../../../http/apis/entertainment/novel/novelApi";
import { toast } from "sonner";
import router from "../../../../router/routes";

export const useNovelUpdateTextCommand = () => {
    const qc = useQueryClient();

    const updateTextMutation = useMutation({
        mutationKey: ["updateText"],
        mutationFn: async ({ data, id }: { data: NovelUpdateInput, id: number }) => {
            const res = await updateNovelText(id, data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["novels"] });
            toast.success("Novel updated successfully");
            router.navigate("/entertainment/novel");
        },
    })
    return {
        updateTextMutation: updateTextMutation?.mutateAsync,
        isUpdatingText: updateTextMutation?.isPending,
    }
}