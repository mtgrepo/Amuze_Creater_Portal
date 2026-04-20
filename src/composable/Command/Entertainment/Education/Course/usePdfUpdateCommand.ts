import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { updateCoursePDF } from "../../../../../http/apis/entertainment/education/courseApi";
import { toast } from "sonner";

export const usePdfUpdateCommand = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const updatePdfMutation = useMutation({
        mutationKey: ["updateCoursePdf"],
        mutationFn: async ({ courseId, pdf }: { courseId: number, pdf: FormData }) => {
            const res = await updateCoursePDF(courseId, pdf);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["courses"] });
            toast.success("Course updated successfully");
            navigate(-1);
        }
    })
    return {
        updatePdfMutation: updatePdfMutation?.mutateAsync,
        isPending: updatePdfMutation?.isPending
    }
}