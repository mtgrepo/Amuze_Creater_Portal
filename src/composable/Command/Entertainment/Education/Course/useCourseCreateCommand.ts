import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCourse } from "../../../../../http/apis/entertainment/education/courseApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useCourseCreateCommand = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const courseCreateMutation = useMutation({
        mutationKey: ['createCourse'],
        mutationFn: async (data: FormData) => {
            const res = await createCourse(data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['gradeList'] });
            toast.success("Course created successfully");
            navigate(-1);
        }
    })
    return {
        courseCreateMutation: courseCreateMutation?.mutateAsync,
        isPending: courseCreateMutation?.isPending
    }
}