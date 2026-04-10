import React, { useCallback } from "react";
import { useDropzone, type Accept } from "react-dropzone";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormSetValue } from "react-hook-form";

type DragAndDropProps = {
  fieldKey: string;
  showLabel?: boolean;
  control: any;
  setValue: UseFormSetValue<any>;
  setFile: (file: File) => void;
  setPreview?: (preview: string | null) => void;
  currentFile: File | null;
};

const DragAndDrop: React.FC<DragAndDropProps> = ({
  fieldKey,
  showLabel = true,
  control,
  setValue,
  setFile,
  setPreview,
  currentFile,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (fieldKey === "file") {
        const validPdf = acceptedFiles.find(
          (file) => file.type === "application/pdf"
        );
        if (validPdf) {
          setFile(validPdf);
          setValue(fieldKey, validPdf, { shouldValidate: true });
          return;
        }
      } else if (
        fieldKey === "thumbnail" ||
        fieldKey === "horizontal_thumbnail" ||
        fieldKey === "display_file" ||
        fieldKey === "preview_file" ||
        fieldKey === "actual_file" ||
        fieldKey === "nrc_front" ||
        fieldKey === "nrc_back"
      ) {
        const validImage = acceptedFiles.find((file) =>
          file.type.startsWith("image/")
        );
        if (validImage) {
          const preview = URL.createObjectURL(validImage);
          setFile(validImage);
          setPreview?.(preview);
          setValue(fieldKey, validImage, { shouldValidate: true });
        }
      }else if( fieldKey === "video"){
        const validVideo = acceptedFiles.find((file) =>
        file.type.startsWith("video/"));
        if(validVideo){
          const preview = URL.createObjectURL(validVideo);
          console.log("✅ setPreview hit with preview:", preview); 
          setFile(validVideo);
          setPreview?.(preview);
          setValue(fieldKey, validVideo, {shouldValidate: true});
        }
      }
       else {
        const validAudio = acceptedFiles.find((file) =>
          file.type.startsWith("audio/")
        );
        if (validAudio) {
          setFile(validAudio);
          setValue(fieldKey, validAudio, { shouldValidate: true });
        }
      }
    },
    [fieldKey, setFile, setPreview, setValue]
  );

  const getAcceptByField = (key: string): Accept => {
    switch (key) {
      case "file":
        return { "application/pdf": [".pdf"] };
      case "thumbnail":
        return { "image/*": [] };
      case "horizontal_thumbnail":
        return { "image/*": [] };
      case "display_file":
        return { "image/*": [] };
      case "preview_file":
        return { "image/*": [] };
      case "actual_file":
        return { "image/*": [] };
      case "nrc_front":
        return {"image/*": []};
      case "nrc_back":
        return {"image/*": []};  
      case "video": 
        return { "video/*": [] };  
      case "audio":
        return { "audio/mpeg": [".mp3"] };
      default:
        return {};
    }
  };

  const maxSizeByField: Record<string, number> = {
    file: 500 * 1024 * 1024,
    thumbnail: 5 * 1024 * 1024,
    horizontal_thumbnail: 5 * 1024 * 1024,
    display_file: 5 * 1024 * 1024,
    preview_file: 5 * 1024 * 1024,
    actual_file: 5 * 1024 * 1024,
    nrc_front: 5 * 1024 * 1024,
    nrc_back: 5 * 1024 * 1024,
    audio: 500 * 1024 * 1024,
    video: Infinity,
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptByField(fieldKey),
    multiple: false,
    maxSize: maxSizeByField[fieldKey],
  });

  return (
    <div>
      <FormField
        control={control}
        name={fieldKey}
        render={() => (
          <FormItem>
            {showLabel && (
              <FormLabel>
                {fieldKey
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </FormLabel>
            )}
            <FormControl>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                  isDragActive ? "border-blue-500" : "border"
                }`}
              >
                <input {...getInputProps()} />
                {currentFile ? (
                  <p className="text-sm text-secondary-foreground">
                    Selected File: {currentFile.name}(
                    {(currentFile.size / 1024).toFixed(2)}KB )
                  </p>
                ) : (
                  <p>
                    {isDragActive
                      ? "Drop your file here..."
                      : "Drag & drop your file here, or click to select files"}
                  </p>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DragAndDrop;
