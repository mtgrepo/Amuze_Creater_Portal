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
import type { MuseumEpisode } from "@/types/response/entertainment/museum/museumEpisodeResponse";

interface ActionsProps {
  episode: MuseumEpisode;
  museumId: number;
  titleId: number;
}

export default function EpisodeActions({
  episode,
  museumId,
  titleId,
}: ActionsProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(
      `/entertainment/museum/${museumId}/title/${titleId}/episode/edit/${episode.id}`,
      {
        state: {
          episode,
          museumId,
          titleId,
        },
      },
    );
  };

    const handleViewDetails = () => {
        navigate(`/entertainment/museum/${museumId}/title/${titleId}/episode/details/${episode.id}`, {
      state: { 
        episode,
        museumId,
        titleId
      },
    });
  }


  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={handleEdit}>
          <ClipboardPenLine className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>

            <DropdownMenuItem onSelect={handleViewDetails}>
          <Info className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>

    </>
  );
}
