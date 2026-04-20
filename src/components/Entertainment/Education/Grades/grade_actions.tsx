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
import type { GradesResponse } from "../../../../types/response/entertainment/education/gradeResponse";

export default function GradeActions(grade: GradesResponse) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/entertainment/education/grades/details/${grade.id}`, {
      state: {
        grade: grade?.name
      }
    });
  };

  const handleEditTitle = () => {
    navigate(`/entertainment/education/grades/edit/${grade.id}`, {
      state: {
        grade: grade?.name
      }
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
          <DropdownMenuLabel>Grade Actions</DropdownMenuLabel>
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
