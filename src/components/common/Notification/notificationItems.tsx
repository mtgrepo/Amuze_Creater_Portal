import React from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import type { Notification } from "@/types/response/notification/notificationResponse";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"

interface NotiProps {
  notifications: Notification;
  onClick: (id: number) => void;
}

const CreatorNotiItem: React.FC<NotiProps> = ({ notifications, onClick }) => {
  const isRead = notifications?.reads[0]?.is_read ?? true;
  return (
    <div
      onClick={() => onClick(notifications?.id)}
      className={cn(
        "flex items-start gap-3 px-4 py-3 cursor-pointer border-b transition-colors hover:bg-muted/50",
        !isRead && "bg-muted/40",
      )}
    >
      <div className="flex gap-2">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage
            src={""}
            alt="user avatar"
          />
          <AvatarFallback>
            {notifications?.title?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col space-y-0.5">
          <p className={cn("text-sm", !isRead && "font-semibold")}>
            {notifications?.title}
          </p>

          <p
            className={cn(
              "text-xs text-muted-foreground line-clamp-2",
              !isRead && "font-semibold text-foreground",
            )}
          >
            {notifications?.body}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {notifications?.created_at
              ? formatDistanceToNowStrict(new Date(notifications.created_at), {
                addSuffix: true,
              })
              : ""}
          </span>
        </div>
      </div>

      {!isRead && (
        <span className="mt-2 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
      )}
    </div>
  );
};

export default CreatorNotiItem;
