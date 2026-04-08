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
import type { MuzeBoxDetailsResponse } from "@/types/response/entertainment/muzeBox/muzeBoxResponse";

export default function MuzeBoxActions(title: MuzeBoxDetailsResponse) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/entertainment/muze-box/title/details/${title.id}`);
  };

  const handleEditTitle = () => {
    navigate(`/entertainment/muze-box/title/edit/${title.id}`, {
      state: title,
    });
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
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>MuzeBox Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewDetails}>
            <Info /> View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleEditTitle}>
            <ClipboardPenLine /> Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  );
}
