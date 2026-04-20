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
import type { CourseDetailsResponse } from "../../../../types/response/entertainment/education/gradeResponse";

interface CourseActionProps {
  course: CourseDetailsResponse;
  titleId: number;
  titleName: string
}

export default function CourseActions({ course, titleId, titleName }: CourseActionProps) {
    console.log("course data", course?.id)
    console.log("grade id", titleId)
  const navigate = useNavigate();

  const handleEditEpisode = () => {
    navigate(`/entertainment/education/${titleId}/course/edit/${course?.id}`, {
      state: {
        course,
        titleId,
        titleName
      },
    });
  };

  const handleViewDetails = () => {
    navigate(`/entertainment/education/${titleId}/courses/details/${course?.id}`, {
      state: {
        course,
        titleId,
        titleName
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
        <DropdownMenuLabel>Course Actions</DropdownMenuLabel>
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