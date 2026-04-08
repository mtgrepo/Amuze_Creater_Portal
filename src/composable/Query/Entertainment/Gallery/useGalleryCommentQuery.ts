import { getGalleryComments } from "@/http/apis/entertainment/gallery/galleryApi";
import { useQuery } from "@tanstack/react-query"

export const useGalleryCommentsQuery = (galleryId: number) => {
    const commentsList = useQuery({
        queryKey: ['galleryComments', galleryId],
        queryFn: async () => {
            const res = await getGalleryComments(galleryId);
            return res?.data 
        },
        enabled: !!galleryId
    })
    return {
        commentsList: commentsList?.data,
        isLoading: commentsList?.isLoading
    }
}