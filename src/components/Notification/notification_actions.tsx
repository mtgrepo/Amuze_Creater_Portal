"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Info, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/types/response/notification/notificationResponse";

import { useState } from "react";
import { toast } from "sonner";
import NotificationDetailsDialog from "./notification_details_dialog";

export default function NotificationActions(notifications: Notification) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const handleViewDetails = () => {
    if (!notifications) {
      toast.error("Failed to fetch promo code details.");
      return;
    }
    setSelectedId(notifications.id);
    setOpen(true);
  };


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
{/* 
          <DropdownMenuItem onClick={handleMarkAsRead}>
            <ClipboardPenLine /> Mark as Read
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      <NotificationDetailsDialog id={selectedId!} open={open} setOpen={setOpen} />
    </>
  );
}
