import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useMuseumTitleDetailsQuery } from "@/composable/Query/Entertainment/Museum/useMuseumTitleDetailQuery";
import MuseumTitleForm from "@/components/Entertainment/Museum/Title/museum_title_form";

export default function TitleUpdatePage() {
  const { id, museumId } = useParams();
  const navigate = useNavigate();

  const { titleDetails, isTitleLoading } = useMuseumTitleDetailsQuery(Number(id));

  if (isTitleLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-gray-400">Loading museum title details...</p>
      </div>
    );
  }

  if (!titleDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <p>Missing Title Context. Please return to the museum detail page.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-400">Go Back</button>
      </div>
    );
  }


  const formDefaults = {
    id:String(titleDetails.id),
    museum_id: titleDetails.museum_id,
    name: titleDetails.name,
    description: titleDetails.description,
    thumbnail: titleDetails.thumbnail,
    created_by: titleDetails.createdUser?.id ?? undefined
  };

  return (
    <div className="p-6 min-h-screen">
      <MuseumTitleForm
        mode="edit"
        museumId={Number(museumId)}
        defaultValues={formDefaults}
        onSuccess={() => navigate(-1)}
      />
    </div>
  );
}