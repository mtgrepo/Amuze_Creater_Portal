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
import type { GalleryResponse } from "@/types/response/entertainment/gallery/galleryResponse";

export default function GalleryActions(title: GalleryResponse) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/entertainment/gallery/details/${title.id}`);
  };

  const handleEditTitle = () => {
    navigate(`/entertainment/gallery/edit/${title.id}`, {
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
          <DropdownMenuLabel>Gallery Actions</DropdownMenuLabel>
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
