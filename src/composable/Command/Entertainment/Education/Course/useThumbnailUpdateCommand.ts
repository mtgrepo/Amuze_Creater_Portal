import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCourseThumbnail } from "../../../../../http/apis/entertainment/education/courseApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useThumbnailUpdateCommand = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const thumbnailUpdateMutation = useMutation({
        mutationKey: ["updateCourseThumbnail"],
        mutationFn: async ({ courseId, data }: { courseId: number, data: FormData }) => {
            const res = await updateCourseThumbnail(courseId, data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["courses"] });
            toast.success("Course updated successfully");
            navigate(-1);
        }
    })
    return {
        thumbnailUpdateMutation: thumbnailUpdateMutation?.mutateAsync,
        isUpdatingThumbnail: thumbnailUpdateMutation?.isPending,
    }
}