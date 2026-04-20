import ProfileDetailsComponent from "@/components/Auth/profile_details_component";
import { SidebarInset } from "@/components/ui/sidebar";
import { useLoginCreatorQuery } from "@/composable/Query/Auth/useLoginCreatorQuery";
import { useProfileHistoryQuery } from "@/composable/Query/Auth/useProfileHistoryQuery";
import { decryptAuthData } from "@/lib/helper";
import { Loader2 } from "lucide-react";

export default function ProfileDetails() {
  const page = 1;
  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);
  const creatorId = loginCreator?.creator?.id;
  const { creatorData, isLoading } = useLoginCreatorQuery(creatorId!);

  const { profileHistoryData, isLoading: profileLoading } =
    useProfileHistoryQuery(creatorId!, page);

  if (isLoading || profileLoading) {
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-gray-400">Loading details...</p>
    </div>;
  }
  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="w-full mt-5 ">
      <ProfileDetailsComponent
        info={creatorData! ?? []}
        profile={profileHistoryData ?? []}
      />
      </div>
    </div>
    </SidebarInset>
  );
}
