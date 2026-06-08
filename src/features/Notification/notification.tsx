import * as React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { decryptAuthData } from "@/lib/helper";
import { useDebounce } from "use-debounce";
import { useNotificationsQuery } from "../../composable/Query/Notification/useNotificationsQuery";
import { NotificationComponent } from "@/components/Notification/notification_component";
import { Button } from "@/components/ui/button";
import { useMarkAllReadCommand } from "@/composable/Command/Notification/useMarkAllReadCommand";
import { CheckCheck } from "lucide-react";

export default function NotificationPage() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 700);

  // We pass the debouncedSearch as a unique key to force a clean state reset 
  // every time a user types a new search query
  return (
    <NotificationListContainer 
      key={debouncedSearch} 
      search={search} 
      onSearchChange={setSearch} 
    />
  );
}

// Internal wrapper that handles specific local table state lifecycle cleanly
function NotificationListContainer({ 
  search, 
  onSearchChange 
}: { 
  search: string; 
  onSearchChange: (val: string) => void 
}) {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [isAllSelected, setIsAllSelected] = React.useState(false);

  const loginCreator = decryptAuthData(localStorage.getItem("creator")!);

  if (!loginCreator?.creator?.id) {
    throw new Error("Creator ID is missing");
  }

  const { notifications, total, isLoading } = useNotificationsQuery({
    page,
    limit,
  });

  const { markAllReadMutation } = useMarkAllReadCommand();

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    setPage(newPage);
    setLimit(newLimit);
  };

  const handleAllSelectedChange = React.useCallback((allSelected: boolean) => {
    setIsAllSelected(allSelected);
  }, []);

  const handleMarkAllRead = async () => {
    await markAllReadMutation();
  };

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="w-full mt-5">
          <div className="flex flex-row justify-between gap-3">
            {isAllSelected && (
              <Button onClick={handleMarkAllRead} variant={'outline'}>
                <CheckCheck className="mr-2 w-4 h-4"/>
                Mark As All Read
              </Button>
            )}
          </div>

          <div className="my-6">
            <NotificationComponent
              data={notifications ?? []}
              total={total}
              page={page}
              limit={limit}
              onPaginationChange={handlePaginationChange}
              isFetching={isLoading}
              search={search}
              onSearchChange={onSearchChange}
              onAllSelectedChange={handleAllSelectedChange}
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}