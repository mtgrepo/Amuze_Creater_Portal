import { updateGalleryThumbnail } from "@/http/apis/entertainment/gallery/galleryApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useGalleryUpdateThumbnailCommand = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();
    const updateThumbnailMutation = useMutation({
        mutationKey: ["updateGalleryThumbnail"],
        mutationFn: async ({galleryId, data}: {galleryId: number, data: FormData}) => {
            const res = await updateGalleryThumbnail(galleryId, data);
            return res?.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["galleryList"] });
            toast.success("Gallery thumbnail updated successfully");
            navigate("/entertainment/gallery");
        },
    })
    return {
        updateThumbnailMutation: updateThumbnailMutation?.mutateAsync,
        isUpdatingThumbnail: updateThumbnailMutation?.isPending,
    }
}