"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClipboardPenLine, FileMusic, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React from "react";
import { AudioView } from "@/components/common/audio_view";
import type { StoryEpisodeResponse } from "@/types/response/entertainment/storytelling/storytellingResponse";

interface EpisodeActionsProps {
  episode: StoryEpisodeResponse;
  titleId?: number;
  titleName?: string
}

export default function EpisodeActions({ episode, titleId, titleName }: EpisodeActionsProps) {
  const navigate = useNavigate();
  const [showAudio, setShowAudio] = React.useState(false);
  const handleEditEpisode = () => {
    navigate(`/entertainment/storytelling/${titleId}/episode/edit/${episode?.id}`, {
      state: {
        episode,
        titleId,
        titleName
      },
    });
  };
  
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


          <DropdownMenuItem onSelect={handleEditEpisode}>
            <ClipboardPenLine className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setShowAudio(true)}>
            <FileMusic className="mr-2 h-4 w-4" /> Audio

          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showAudio && (
        <AudioView
          fileUrl={episode.file_path}
          open={showAudio}
          onClose={() => setShowAudio(false)}
        />
      )}
    </>
  );
}