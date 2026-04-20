import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCourseText } from "../../../../../http/apis/entertainment/education/courseApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useTextUpdateCommand = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const textUpdateMutation = useMutation({
        mutationKey: ['updateCourseText'],
        mutationFn: async ({courseId, name, price, grade_id} : { courseId: number, name: string, price: number, grade_id: number}) => {
            const res = await updateCourseText(courseId, name, price, grade_id);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['gradeList'] });
            toast.success("Course text updated successfully");
            navigate(-1);
        }
    })
    return {
        textUpdateMutation: textUpdateMutation?.mutateAsync,
        isPending: textUpdateMutation?.isPending
    }
}