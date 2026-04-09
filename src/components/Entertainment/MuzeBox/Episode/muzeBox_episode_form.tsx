"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/common/image_upload";
// Replace with your actual Loader/Spinner component
const Spinner = () => <span className="animate-spin mr-2">◌</span>;

import { decryptAuthData } from "@/lib/helper";
import { getPresignedUploadUrl } from "../../../../http/apis/entertainment/muzeBox/muzeBoxEpisodeApi";
import router from "../../../../router/routes";
import { useParams } from "react-router-dom";

type UploadedPart = {
    partNumber: number;
    etag: string;
};

function createFormSchema(mode: "add" | "edit") {
    const imageSchema =
        mode === "add"
            ? z.custom<File>((val) => val instanceof File, "Image is required")
            : z.union([z.instanceof(File), z.string()]).optional();

    return z.object({
        // Changed to optional so "Add" mode doesn't fail validation before submission
        id: z.number().optional(),
        name: z.string().min(1, "Name is required."),
        description: z.string().min(1, "Description is required"),
        price: z.number().min(0, "Price must be 0 or greater"),
        thumbnail: imageSchema,
        video: z
            .custom<File>((file) => file instanceof File, {
                message: "Video file is required.",
            })
            .refine(
                (file) =>
                    !file || ["video/mp4", "video/avi", "video/quicktime"].includes(file.type),
                { message: "Only valid video files are allowed." }
            ),
        created_by: z.union([z.string(), z.number()]).optional(),
    });
}

type MuzeBoxValues = z.infer<ReturnType<typeof createFormSchema>>;

interface MuzeBoxFormProps {
    mode: "add" | "edit";
    defaultValues?: Partial<MuzeBoxValues> & { id?: string | number };
    onSuccess?: () => void;
}

export default function MuzeBoxEpisodeForm({ mode, defaultValues, onSuccess }: MuzeBoxFormProps) {
    const { id } = useParams();
    const formSchema = createFormSchema(mode);

    // Placeholder loading states - replace these with your actual mutation hooks
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<MuzeBoxValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: defaultValues?.id ? Number(defaultValues.id) : undefined,
            name: defaultValues?.name || "",
            description: defaultValues?.description || "",
            price: defaultValues?.price || 0,
            thumbnail: defaultValues?.thumbnail || undefined,
            video: defaultValues?.video || undefined,
            created_by: "",
        },
    });

    useEffect(() => {
        if (defaultValues) {
            form.reset({
                id: defaultValues.id ? Number(defaultValues.id) : undefined,
                name: defaultValues.name || "",
                description: defaultValues.description || "",
                price: defaultValues.price ?? 0,
                thumbnail: defaultValues.thumbnail,
                video: defaultValues.video,
                created_by: form.getValues("created_by"),
            });
        }
    }, [defaultValues, form]);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem("creator");
            if (storedData) {
                const loginCreator = decryptAuthData(storedData);
                const id = loginCreator?.creator?.id;
                if (id) form.setValue("created_by", id);
            }
        } catch (error) {
            console.error("Failed to load creator data:", error);
        }
    }, [form]);

    async function getChunkPresignedUploadUrl(file: File, seriesId: number, episodeName: string, parts: number) {
        const data = {
            contentType: file.type,
            seriesId: seriesId,
            episodeName: episodeName,
            parts
        };
        return await getPresignedUploadUrl(data);
    }

    async function uploadMultipart(file: File, presignedParts: any[], chunkSizeMB: number = 0) {
        console.log("In upload multi part", presignedParts)
        const uploadedParts: UploadedPart[] = [];
        const concurrency = Number(import.meta.env.UPLOAD_CONCURRENCY) || 4;
        let index = 0;

        async function uploadNext() {
            if (index >= presignedParts.length) return;

            const current = index++;
            const { partNumber, url } = presignedParts[current];
            let chunk: Blob;

            if (chunkSizeMB === 0) {
                chunk = file;
            } else {
                const start = (partNumber - 1) * (chunkSizeMB * 1024 * 1024);
                const end = Math.min(start + (chunkSizeMB * 1024 * 1024), file.size);
                chunk = file.slice(start, end);
            }

            const res = await fetch(url, {
                method: "PUT",
                body: chunk
            });

            if (!res.ok) throw new Error(`Upload failed for part ${partNumber}`);

            const rawEtag = res.headers.get("ETag");
            if (!rawEtag) throw new Error(`Missing ETag for part ${partNumber}`);

            const etag = rawEtag.replace(/"/g, "");
            uploadedParts.push({ partNumber, etag });

            await uploadNext();
        }

        await Promise.all(Array(concurrency).fill(0).map(uploadNext));
        return uploadedParts;
    }

    const bytesToMB = (bytes: number, decimals = 2): number => {
        const factor = Math.pow(10, decimals);
        return Math.round((bytes / (1024 * 1024)) * factor) / factor;
    };

    const onSubmit = async (values: MuzeBoxValues) => {
        setIsSubmitting(true);
        try {
            const videoFile = values.video as File;
            const fileSizeMB = bytesToMB(videoFile.size);
            let parts = 1;
            let newChunkSizeMB = 0;

            if (fileSizeMB >= 200) {
                newChunkSizeMB = fileSizeMB <= 1024 ? 30 : 50;
                const chunkSize = newChunkSizeMB * 1024 * 1024;
                parts = Math.ceil(videoFile.size / chunkSize);
            }

            // Series ID is usually passed from defaultValues or a parent context
            const seriesId = Number(id);
            if (!seriesId && mode === "add") throw new Error("Series ID is required to upload an episode.");
            console.log("series id", seriesId)
            const uploadUrls = await getChunkPresignedUploadUrl(videoFile, seriesId, values.name, parts);
            console.log("upload urls", uploadUrls)
            const uploadedParts = await uploadMultipart(videoFile, uploadUrls.data.urls, newChunkSizeMB);

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("series_id", String(seriesId));
            formData.append("thumbnail", values.thumbnail as File);
            formData.append("tempFilePath", uploadUrls.data.tempFilePath);
            formData.append("price", values.price.toString());
            formData.append("uploadId", uploadUrls.data.uploadId);
            formData.append("parts", JSON.stringify(uploadedParts.sort((a, b) => a.partNumber - b.partNumber)));

            if (mode === "add") {
                // await muzeBoxCreateMutation(formData);
console.log("FormData:", Object.fromEntries(formData.entries()));
            } else {
                // Handle Update Logic
                toast.success("Episode updated successfully!");
            }

            form.reset();
            onSuccess?.();
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 border rounded-xl shadow-sm">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                    <div className="border-b pb-4">
                        <h2 className="text-2xl font-bold">
                            {mode === "add" ? "Create New Episode" : "Edit Episode"}
                        </h2>
                    </div>

                    <div className="space-y-6 max-w-sm mx-auto">
                        <FormField
                            control={form.control}
                            name="thumbnail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thumbnail</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter name..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="0.00"
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Enter description..." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="video"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video File</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                fieldType="video"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t items-center">
                        <Button
                            className="flex-1"
                            type="button"
                            variant="outline"
                            onClick={() => router.navigate('/erntertainment/muze-box')}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Spinner />}
                            {mode === "add" ? "Upload Episode" : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}