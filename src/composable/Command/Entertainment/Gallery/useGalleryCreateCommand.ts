import { createGallery } from "@/http/apis/entertainment/gallery/galleryApi";
import router from "@/router/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGalleryCreateCommand = () => {
  const qc = useQueryClient();

  const createGalleryMutation = useMutation({
    mutationKey: ["createGallery"],
    mutationFn: async (data: FormData) => {
      const res = await createGallery(data);
      return res?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["galleryList"] });
      toast.success("Gallery created successfully");
      router.navigate("/entertainment/gallery");
    },
  });
  return {
    createGalleryMutation: createGalleryMutation?.mutateAsync,
    isPending: createGalleryMutation?.isPending,
  };
};
