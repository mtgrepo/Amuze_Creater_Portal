import { Music, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone"

interface AudioUploadProps {
    value?: File | string | null;
    onChange: (file: File | null) => void;
}

export default function AudioUpload({ value, onChange }: AudioUploadProps) {
    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) onChange(file)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "audio/*": []
        },
        multiple: false
    });
    const handleRemove = () => onChange(null);
    return (
        <div>
            {!value ? (
                <div
                    {...getRootProps()}
                    className={`h-40 w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition
            ${isDragActive ? "border-primary bg-accent" : "border-muted-foreground/25"}
          `}
                >
                    <input {...getInputProps()} />

                    <Upload className="h-8 w-8 mb-2" />
                    <p className="text-sm">
                        {isDragActive ? "Drop audio here..." : "Drag & drop or click"}
                    </p>
                </div>
            ) : (
                <div className="relative border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Music className="w-6 h-6" />

                        {typeof value === "string" ? (
                            <audio controls className="w-full">
                                <source src={value} />
                            </audio>
                        ) : (
                            <div className="w-full">
                                <p className="text-sm">{value.name}</p>
                                <audio controls className="w-full mt-2">
                                    <source src={URL.createObjectURL(value)} />
                                </audio>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}