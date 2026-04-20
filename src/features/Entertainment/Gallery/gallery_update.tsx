import GalleryForm from "@/components/Entertainment/Gallery/gallery_form";
import { useGalleryDetailsQuery } from "@/composable/Query/Entertainment/Gallery/useGalleryDetailsQuery";
import { useLocation, useParams } from "react-router-dom";

export default function GalleryUpdate() {
  const { state } = useLocation();
  const { id } = useParams();
  
const { galleryDetails, isLoading} = useGalleryDetailsQuery(Number(id));

  // Merge state and API data, prioritizing API data once it arrives
  const gallery = galleryDetails || state;

  if (isLoading && !gallery) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Loading gallery data...</p>
      </div>
    );
  };
  return (
    <div className="p-6">
      <GalleryForm
        mode="edit"
        defaultValues={{
          id: id,
          name: gallery.name,
          description: gallery.description,
          price: gallery.price,
          generes: gallery.generes?.map((g: any) => g.id.toString()) || [],
          thumbnail: gallery.thumbnail,
          preview_file: gallery.preview_file ,
          display_file: gallery.display_file,
        }}
      />
    </div>
  );
}
