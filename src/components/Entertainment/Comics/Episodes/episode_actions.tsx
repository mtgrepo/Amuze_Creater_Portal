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
import type { ComicsTitleDetailsResponse } from "@/types/response/entertainment/comics/comicsTitleDetailsResponse";

export default function EpisodeActions(episode: ComicsTitleDetailsResponse) {
  const navigate = useNavigate();

//   const handleViewDetails = () => {
//     navigate(`/entertainment/comics/details/${title.id}`);
//   };

//   const handleEditTitle = () => {
//     navigate(`/entertainment/comics/edit/${title.id}`, {
//       state: title,
//     });
//   };

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
          <DropdownMenuItem >
            <Info /> View Details
          </DropdownMenuItem>

          <DropdownMenuItem >
            <ClipboardPenLine /> Edit Episode
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  );
}
