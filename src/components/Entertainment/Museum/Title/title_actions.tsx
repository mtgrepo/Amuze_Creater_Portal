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
import type { MuseumTitleDetailResponse } from "@/types/response/entertainment/museum/museumTitleDetailResponse";

interface TitleActionsProps {
  title: MuseumTitleDetailResponse,
  museumId: number,
}

export default function TitleActions({ title, museumId }: TitleActionsProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/entertainment/museum/${museumId}/title/edit/${title?.id}`, {
      state: { 
       title,
       museumId 
      },
    });
  };

  const handleViewDetails = () => {
        navigate(`/entertainment/museum/${museumId}/title/details/${title?.id}`, {
      state: { 
        title,
        museumId 
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
          <ClipboardPenLine className="mr-2 h-4 w-4" /> Edit Title
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}