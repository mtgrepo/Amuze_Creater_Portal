import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNovel } from "../../../../http/apis/entertainment/novel/novelApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useNovelCreateCommand = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const novelCreateMutation = useMutation({
        mutationKey: ["create-novel"],
        mutationFn: async (data: FormData) => {
            const res = await createNovel(data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["novels"] });
            toast.success("Novel created successfully");
            navigate("/entertainment/novel");
        }

    })
    return {
        novelCreateMutation: novelCreateMutation?.mutateAsync,
        isNovelCreating: novelCreateMutation?.isPending
    }
}