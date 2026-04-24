import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { useNotificationDetailsQuery } from "@/composable/Query/Notification/useNotificationDetailsQuery";
import { Badge } from "../ui/badge";

export default function NotificationDetailsDialog({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: number;
}) {
    const { notificationDetails } = useNotificationDetailsQuery(id)
    // console.log("noti details", notificationDetails)
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-4 border-b bg-muted/40">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-500">
              <Info className="w-5 h-5" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {notificationDetails?.type || "Notification"}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(notificationDetails?.sent_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 space-y-4">
            {/* Category */}
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                CATEGORY
              </span>
              <div className="mt-1">
                <Badge>
                    {notificationDetails?.category}
                </Badge>
              </div>
            </div>

            {/* Message */}
            <div className="pb-5">
              <span className="text-xs font-medium text-muted-foreground">
                MESSAGE
              </span>
              <p className="mt-1 text-sm">{notificationDetails?.body}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
