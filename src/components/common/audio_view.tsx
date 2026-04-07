import React from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AudioViewProps {
  fileUrl?: string;
  open: boolean;
  onClose: () => void;
}

export const AudioView: React.FC<AudioViewProps> = ({
  fileUrl,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Audio Player</DialogTitle>
        </DialogHeader>

        <div className="audio-player flex flex-col items-center gap-4 mt-2">
          <AudioPlayer
            autoPlay={false}
            src={fileUrl}
            showJumpControls={true}
            customAdditionalControls={[]}
            progressJumpSteps={{
              backward: 5000,
              forward: 5000,
            }}
            style={{ background: "var(--background)" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};