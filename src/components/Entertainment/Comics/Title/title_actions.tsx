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
import type { ComicsTitleResponse } from "@/types/response/entertainment/comics/comicsTitleResponse";
import { Button } from "@/components/ui/button";

export default function TitleActions(title: ComicsTitleResponse) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/entertainment/comics/details/${title.id}`);
  };

  const handleEditTitle = () => {
    navigate(`/entertainment/comics/edit/${title.id}`, {
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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewDetails}>
            <Info /> View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleEditTitle}>
            <ClipboardPenLine /> Edit Title
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  );
}
