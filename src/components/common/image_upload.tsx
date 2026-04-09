import { Upload, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import ImageCropDialog from "./image_crop_dialog"

interface MediaUploadProps {
    value?: File | string | null
    onChange: (file: File | null) => void
    label?: string
    size?: "small" | "large"
    maxSizeMB?: number
    fieldType?: "image" | "video" 
}

export default function ImageUpload({
    value,
    onChange,
    label,
    size = "small",
    maxSizeMB = 50,
    fieldType = "image" // default = image
}: MediaUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [fileType, setFileType] = useState<"image" | "video" | null>(null)

    const [cropDialogOpen, setCropDialogOpen] = useState(false)
    const [rawImageSrc, setRawImageSrc] = useState<string | null>(null)
    const [rawFile, setRawFile] = useState<File | null>(null)

    const inputRef = useRef<HTMLInputElement | null>(null)

    const acceptType = fieldType === "image" ? "image/*" : "video/*"

    useEffect(() => {
        if (!value) return

        if (typeof value === "string") {
            setPreview(value)
        } else {
            const reader = new FileReader()
            reader.onloadend = () => setPreview(reader.result as string)
            reader.readAsDataURL(value)

            setFileType(value.type.startsWith("video/") ? "video" : "image")
        }
    }, [value])

    const validateFile = (file: File) => {
        const maxBytes = maxSizeMB * 1024 * 1024
        if (file.size > maxBytes) {
            alert(`File too large. Max ${maxSizeMB}MB`)
            return false
        }
        return true
    }

    const handleFile = (file: File) => {
        if (!validateFile(file)) return

        const isImage = file.type.startsWith("image/")
        const isVideo = file.type.startsWith("video/")

        // enforce fieldType
        if (fieldType === "image" && !isImage) {
            alert("Please select an image file")
            return
        }

        if (fieldType === "video" && !isVideo) {
            alert("Please select a video file")
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            const result = reader.result as string

            if (isImage) {
                setRawImageSrc(result)
                setRawFile(file)
                setCropDialogOpen(true)
            } else {
                applyFile(file)
            }
        }

        reader.readAsDataURL(file)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        e.target.value = ""
        handleFile(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (!file) return
        handleFile(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const applyFile = (file: File) => {
        const isVideo = file.type.startsWith("video/")
        setFileType(isVideo ? "video" : "image")

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
        setFileType(null)
    }

    const sizeClasses = size === "large" ? "h-50 w-50" : "h-60 w-full"

    return (
        <>
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{label}</label>

                <div className="flex items-start">
                    {preview ? (
                        <div className={`relative ${sizeClasses}`}>
                            {fileType === "video" ? (
                                <video
                                    src={preview}
                                    className="h-full w-full rounded-lg object-cover border-2 border-border"
                                    controls
                                />
                            ) : (
                                <img
                                    src={preview}
                                    alt={label}
                                    className="h-full w-full rounded-lg object-cover border-2 border-border"
                                />
                            )}

                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-1.5 hover:bg-destructive/90 shadow-md"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => inputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className={`${sizeClasses} cursor-pointer flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50 transition-all group`}
                        >
                            <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />

                            <span className="mt-2 text-xs text-muted-foreground group-hover:text-primary">
                                Click or drag to upload ({fieldType})
                            </span>

                            <input
                                ref={inputRef}
                                type="file"
                                className="hidden"
                                accept={acceptType}
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                </div>
            </div>

            {rawImageSrc && rawFile && fieldType === "image" && (
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