import ComicTitleForm from "@/components/Entertainment/Comics/Title/title_form";
import { useComicsTitleDetailsQuery } from "@/composable/Query/Entertainment/Comics/useComicsTitleDetailsQuery";
import { useLocation, useParams } from "react-router-dom";

export default function EditTitlePage() {
  const { state } = useLocation();
  const { id } = useParams();
  
  // Fetch details in case the user refreshes the page and 'state' is lost
  const { titleDetails, isLoading } = useComicsTitleDetailsQuery(id!);

  // Merge state and API data, prioritizing API data once it arrives
  const title = titleDetails || state;

  if (isLoading && !title) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <ComicTitleForm
        mode="edit"
        defaultValues={{
          id: id,
          name: title?.name,
          description: title?.description,
          price: title?.price,
          // Ensure genres is an array of strings
          genres: title?.genres?.map((g: any) => g.id.toString()) || [],
          thumbnail: title?.thumbnail,
          horizontal_thumbnail: title?.horizontal_thumbnail,
        }}
      />
    </div>
  );
}