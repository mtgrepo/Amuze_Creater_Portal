import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNovel } from "../../../../http/apis/entertainment/novel/novelApi";
import { toast } from "sonner";
import router from "../../../../router/routes";

export const useNovelCreateCommand = () => {
    const qc = useQueryClient();
    const novelCreateMutation = useMutation({
        mutationKey: ["create-novel"],
        mutationFn: async (data: FormData) => {
            const res = await createNovel(data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["novels"] });
            toast.success("Novel created successfully");
            router.navigate("/entertainment/novel");
        }

    })
    return {
        novelCreateMutation: novelCreateMutation?.mutateAsync,
        isNovelCreating: novelCreateMutation?.isPending
    }
}