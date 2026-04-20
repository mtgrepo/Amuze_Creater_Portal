import { createGallery } from "@/http/apis/entertainment/gallery/galleryApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useGalleryCreateCommand = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const createGalleryMutation = useMutation({
    mutationKey: ["createGallery"],
    mutationFn: async (data: FormData) => {
      const res = await createGallery(data);
      return res?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["galleryList"] });
      toast.success("Gallery created successfully");
      navigate("/entertainment/gallery");
    },
  });
  return {
    createGalleryMutation: createGalleryMutation?.mutateAsync,
    isPending: createGalleryMutation?.isPending,
  };
};
