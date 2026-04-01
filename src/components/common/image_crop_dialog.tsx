import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import type { Area } from "react-easy-crop"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

async function getCroppedImg(imageSrc: string, croppedAreaPixels: Area, originalFile: File): Promise<File> {
    const image = new Image()
    image.src = imageSrc
    await new Promise<void>((resolve) => { image.onload = () => resolve() })

    const canvas = document.createElement("canvas")
    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height
    const ctx = canvas.getContext("2d")!

    ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) { reject(new Error("Canvas is empty")); return }
            resolve(new File([blob], originalFile.name, { type: originalFile.type }))
        }, originalFile.type)
    })
}

interface ImageCropDialogProps {
    open: boolean
    imageSrc: string
    originalFile: File
    onCropSave: (file: File) => void
    onUseOriginal: () => void
    onClose: () => void
}

export default function ImageCropDialog({
    open,
    imageSrc,
    originalFile,
    onCropSave,
    onUseOriginal,
    onClose,
}: ImageCropDialogProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const onCropComplete = useCallback((_: Area, cropped: Area) => {
        setCroppedAreaPixels(cropped)
    }, [])

    const handleCropSave = async () => {
        if (!croppedAreaPixels) return
        const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, originalFile)
        onCropSave(croppedFile)
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>

                {/* Crop area */}
                <div className="relative w-full h-72 bg-black rounded-md overflow-hidden">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                {/* Zoom slider */}
                <div className="space-y-1.5 px-1">
                    <p className="text-xs text-muted-foreground">Zoom</p>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
                    />
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" onClick={onUseOriginal}>
                        Use Original
                    </Button>
                    <Button onClick={handleCropSave}>
                        Crop & Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
