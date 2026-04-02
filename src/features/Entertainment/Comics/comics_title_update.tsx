import ComicTitleForm from "@/components/Entertainment/Comics/Title/title_form";
import { useComicsTitleDetailsQuery } from "@/composable/Query/Entertainment/Comics/useComicsTitleDetailsQuery";
import { decryptAuthData } from "@/lib/helper";
import { useLocation, useParams } from "react-router-dom";

export default function EditTitlePage() {
  const { state } = useLocation();
  const { id } = useParams();

  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creator = loginCreator?.creator;
  const userId = Number(creator?.id);
  const roleId = Number(creator?.role_id);
  const payload = {
    id: id!,
    roleId: roleId,
    userId: userId,
  };
  
  // Fetch details in case the user refreshes the page and 'state' is lost
  const { titleDetails, isLoading } = useComicsTitleDetailsQuery(payload);

  // Merge state and API data, prioritizing API data once it arrives
  const title = titleDetails || state;

  if (isLoading && !title) return <p>Loading...</p>;
  // console.log("edit data", title?.generes);
  return (
    <div className="p-6">
      <ComicTitleForm
        mode="edit"
        defaultValues={{
          id: id,
          name: title?.name,
          description: title?.description,
          price: title?.price,
          genres: title?.generes?.map((g: any) => g.id.toString()) || [],
          thumbnail: title?.thumbnail,
          horizontal_thumbnail: title?.horizontal_thumbnail,
        }}
      />
    </div>
  );
}
