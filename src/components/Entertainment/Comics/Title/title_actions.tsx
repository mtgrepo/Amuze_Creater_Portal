"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleCheck, ClipboardPenLine, Info, MoreHorizontal, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ComicsTitleResponse } from "@/types/response/entertainment/comics/comicsTitleResponse";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";


export default function TitleActions(title: ComicsTitleResponse) {
  const navigate = useNavigate();
  const [showVerify, setShowVerify] = useState(false);
  const [open, setOpen] = useState(false);

  const handleViewDetails = () => {
    navigate(`/drivers/details/${title.id}`);
  };

const handleEditTitle = () => {
  navigate(`/entertainment/comics/edit/${title.id}`, {
    state: title, // 👈 pass full data here
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
          <Separator />
          <DropdownMenuItem onClick={handleViewDetails}>
            <Info /> View Driver
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditTitle}>
            <ClipboardPenLine /> Edit Title
          </DropdownMenuItem>

          
        </DropdownMenuContent>
      </DropdownMenu>



      {/* Drawer */}
      {/* <DrawerFormLayout
        open={open}
        setOpen={setOpen}
        title="Add Wallet"
        description="Update Wallet Amount below."
        formContent={
          <AddWalletForm onSuccess={() => setOpen(false)} walletId={driver?.walletId}/>
        }
        cancelButton={
          <Button variant="outline" className="w-full my-3">
            Cancel
          </Button>
        }
      /> */}

    </>
  );
}
