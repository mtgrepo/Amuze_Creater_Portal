"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClipboardPenLine, Info, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { ComicsTitleDetailsResponse } from "@/types/response/entertainment/comics/comicsTitleDetailsResponse";

interface EpisodeActionsProps {
  episode: ComicsTitleDetailsResponse;
  titleId: number;
  titleName: string
}

export default function EpisodeActions({ episode, titleId, titleName }: EpisodeActionsProps) {
  const navigate = useNavigate();

  const handleEditEpisode = () => {
    // We add titleId to the state object here
    navigate(`/entertainment/muze-box/${titleId}/episode/edit/${episode?.id}`, {
      state: {
        episode,
        titleId,
        titleName
      },
    });
  };

  const handleViewDetails = () => {
    navigate(`/entertainment/muze-box/${titleId}/episode/details/${episode?.id}`, {
      state: {
        episode,
        titleId,
        titleName
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Note: Ensure this is not wrapped in another <button> in the parent */}
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={handleViewDetails}>
          <Info className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={handleEditEpisode}>
          <ClipboardPenLine className="mr-2 h-4 w-4" /> Edit Episode
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}