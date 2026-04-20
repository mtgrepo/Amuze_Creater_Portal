import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateNovelPdf } from "../../../../http/apis/entertainment/novel/novelApi";
import { toast } from "sonner";

export const useNovelUpdatePdfCommand = () => {
    const qc  = useQueryClient();

    const updatePdfMutation = useMutation({
        mutationKey: ["updateNovelPdf"],
        mutationFn: async ({ id, pdf }: { id: number, pdf: FormData }) => {
            const res = await updateNovelPdf(id, pdf);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["novels"] });
            toast.success("Novel updated successfully");
            // navigate("/entertainment/novel");
        }
    })
    return {
        updatePdfMutation: updatePdfMutation?.mutateAsync,
        isUpdatingPdf: updatePdfMutation?.isPending,
    }
}