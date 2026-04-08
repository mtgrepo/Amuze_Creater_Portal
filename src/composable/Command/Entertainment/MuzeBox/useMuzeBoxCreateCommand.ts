import { createMuzeBox } from "@/http/apis/entertainment/muzeBox/muzeBoxApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useMuzeBoxCreateCommand = () => {
    const qc = useQueryClient();

    const muzeBoxCreateMutation = useMutation({
        mutationKey: ['createMuzeBox'],
        mutationFn: async (data: FormData) => {
            const res = await createMuzeBox(data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["muzeBoxList"] });
            router.navigate('/entertainment/muze-box');
            toast.success("MuzeBox created successfully");
        }
    })
    return {
        muzeBoxCreateMutation: muzeBoxCreateMutation?.mutateAsync,
        isPending: muzeBoxCreateMutation?.isPending
    }
}