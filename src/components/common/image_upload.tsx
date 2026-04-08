import { Upload, X } from "lucide-react"
import { useState, useEffect } from "react"
import ImageCropDialog from "./image_crop_dialog"

interface ImageUploadProps {
    value?: File | string | null
    onChange: (file: File | null) => void
    label?: string
    accept?: string
    size?: "small" | "large"
}

export default function ImageUpload({ 
    value, 
    onChange, 
    label, 
    accept = "image/*", 
    size = "small" 
}: ImageUploadProps) {
    // 1. Initial State
    const [preview, setPreview] = useState<string | null>(
        typeof value === "string" ? value : null
    );
    
    // We keep track of the 'previous value' to detect changes during render
    // const [prevValue, setPrevValue] = useState<File | string | null>(value || null);

    // 2. Adjust state during render (React 19 / Compiler compliant)
    // This replaces the synchronous part of the useEffect and fixes the Lint Error.
    // if (value !== prevValue) {
    //     setPrevValue(value || null);
    //     if (typeof value === "string") {
    //         setPreview(value);
    //     } else if (!value) {
    //         setPreview(null);
    //     }
    //     // Note: We don't setPreview for File here because it's asynchronous
    // }

    useEffect(() => {
         if (typeof value === "string") {
            setPreview(value);
        } else if (!value) {
            setPreview(null);
        }
    }, [value])

    // 3. Effect for Asynchronous File Loading ONLY
    useEffect(() => {
        // If it's not a File, we already handled it in the render block above
        if (!(value instanceof File)) return;

        let isCancelled = false;
        const reader = new FileReader();
        
        reader.onloadend = () => {
            if (!isCancelled) {
                const result = reader.result as string;
                setPreview(result);
            }
        };
        reader.readAsDataURL(value);

        return () => {
            isCancelled = true;
        };
    }, [value]);

    const [cropDialogOpen, setCropDialogOpen] = useState(false)
    const [rawImageSrc, setRawImageSrc] = useState<string | null>(null)
    const [rawFile, setRawFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        
        e.target.value = ""

        const reader = new FileReader()
        reader.onloadend = () => {
            setRawImageSrc(reader.result as string)
            setRawFile(file)
            setCropDialogOpen(true)
        }
        reader.readAsDataURL(file)
    }

    const applyFile = (file: File) => {
        onChange(file)
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result as string)
        reader.readAsDataURL(file)
        
        setCropDialogOpen(false)
        setRawImageSrc(null)
        setRawFile(null)
    }

    const handleCropSave = (croppedFile: File) => applyFile(croppedFile)

    const handleUseOriginal = () => {
        if (rawFile) applyFile(rawFile)
    }

    const handleDialogClose = () => {
        setCropDialogOpen(false)
        setRawImageSrc(null)
        setRawFile(null)
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onChange(null)
        setPreview(null)
    }

    const sizeClasses = size === "large"
        ? "h-40 w-40"
        : "h-60 w-full"

    return (
        <>
            <div className="space-y-2">
                {label && (
                    <label className="text-sm font-medium text-muted-foreground">
                        {label}
                    </label>
                )}
                <div className="flex items-start">
                    {preview ? (
                        <div className={`relative ${sizeClasses}`}>
                            <img
                                src={preview}
                                alt={label || "Upload preview"}
                                className="h-full w-full rounded-lg object-cover border-2 border-border"
                            />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-1.5 hover:bg-destructive/90 shadow-md transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ) : (
                        <label className={`${sizeClasses} cursor-pointer flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50 transition-all group`}>
                            <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="mt-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                Click to upload
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept={accept}
                                onChange={handleFileChange}
                            />
                        </label>
                    )}
                </div>
            </div>

            {rawImageSrc && rawFile && (
                <ImageCropDialog
                    open={cropDialogOpen}
                    imageSrc={rawImageSrc}
                    originalFile={rawFile}
                    onCropSave={handleCropSave}
                    onUseOriginal={handleUseOriginal}
                    onClose={handleDialogClose}
                />
            )}
        </>
    )
}