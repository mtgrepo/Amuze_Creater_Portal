"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ClipboardPenLine,
  Info,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/types/response/notification/notificationResponse";

export default function NotificationActions(notifications: Notification) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/notifications/details/${notifications.id}`, {
      state: {
        titleName: notifications?.title
      }
    });
  };

  const handleMarkAsRead = () => {
    //call mark as read api
  }

  return (
    <>
      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-full">
          <DropdownMenuLabel>Notifications Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewDetails}>
            <Info /> View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleMarkAsRead}>
            <ClipboardPenLine /> Mark as Read
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  );
}
