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

interface TitleActionsProps {
  episode: ComicsTitleDetailsResponse;
  museumId?:number,
  titleId?: number; 
}

export default function TitleActions({ episode, museumId, titleId }: TitleActionsProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/entertainment/museum/${museumId}/title/edit/${episode?.id}`, {
      state: { 
        episode, 
        museumId,
        titleId 
      },
    });
  };

  const handleViewDetails = () => {
        navigate(`/entertainment/museum/${museumId}/episode/details/${episode?.id}`, {
      state: { 
        episode, 
        museumId,
        titleId 
      },
    });
  }

  return (
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

        <DropdownMenuItem onSelect={handleViewDetails}>
          <Info className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={handleEdit}>
          <ClipboardPenLine className="mr-2 h-4 w-4" /> Edit Episode
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}