import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../../components/ui/input";
import { useGradesQuery } from "../../../../composable/Query/Entertainment/Education/Grades/useGradesQuery";
import { GradeComponent } from "../../../../components/Entertainment/Education/Grades/grade_component";
import { decryptAuthData } from "../../../../lib/helper";

export default function Grades() {
  const [tab, setTab] = React.useState<"all" | "approved" | "published">("all");
  const [search, setSearch] = React.useState("");
  const [creatorId, setCreatorId] = React.useState<number | undefined>();


  React.useEffect(() => {
    const storedData = localStorage.getItem("creator");
    if (!storedData) return;

    const loginCreator = decryptAuthData(storedData);
    setCreatorId(loginCreator?.creator?.id);
  }, []);

  const queryParams = React.useMemo(() => {
    switch (tab) {
      case "approved":
        return { approve_status: 1 };
      case "published":
        return { is_published: true };
      default:
        return {};
    }
  }, [tab]);


  const { gradeList: apiData, isLoading } = useGradesQuery({
        authorId: creatorId ?? 0,
    approve_status: queryParams?.approve_status,
  });

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="w-full mt-5 ">
          <div className="flex flex-row justify-end gap-3">
            <Input
              placeholder="Filter name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button
              size={"sm"}
              className="cursor-pointer"
              onClick={() => navigate("/entertainment/education/grades/create")}
            >
              <CirclePlus className="w-4 h-4" />
              {t("create_new_grade")}
            </Button>
          </div>
          <div className="border border-border p-3 rounded-lg my-3">
            <Tabs
              value={tab}
              onValueChange={(val) =>
                setTab(val as "all" | "approved" | "published")
              }
              className="w-full my-5"
            >
              <TabsList className="w-full grid grid-cols-2" variant={"line"}>
                <TabsTrigger value="all" className="w-full text-center">
                  {t("all")}
                </TabsTrigger>
                <TabsTrigger value="approved" className="w-full text-center">
                  {t("approved")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all"></TabsContent>
              <TabsContent value="approved" />
            </Tabs>

            <GradeComponent
              data={apiData ?? []}
              isFetching={isLoading}
              search={search}
              onSearchChange={setSearch}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
