"use client";

import { useEffect } from "react";
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

import { decryptAuthData } from "@/lib/helper";
import router from "@/router/routes";
import { useMuzeBoxCreateCommand } from "@/composable/Command/Entertainment/MuzeBox/useMuzeBoxCreateCommand";
import { Spinner } from "@/components/ui/spinner";
import { useMuzeBoxUpdateTextCommand } from "@/composable/Command/Entertainment/MuzeBox/useMuzeBoxUpdateTextCommand";
import { useMuzeBoxUpdateThumbnailCommand } from "@/composable/Command/Entertainment/MuzeBox/useMuzeBoxUpdateThumbnailCommand";

function createFormSchema(mode: "add" | "edit") {
    const imageSchema =
        mode === "add"
            ? z.custom<File>((val) => val instanceof File, "Image is required")
            : z.union([z.instanceof(File), z.string()]).optional();

    return z.object({
        id: z.number().min(1, "MuzeBox Title Id is required."),
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
                    file === null ||
                    ["video/mp4", "video/avi", "video/quicktime"].includes(file.type),
                { message: "Only valid video files are allowed." }
            ),

        // age_rating: z.number().min(0).optional(),
        // preview: z.number().min(0).optional(),
        // genres: z.array(z.string()).min(1, "Select at least one genre"),

        // horizontal_thumbnail: imageSchema,

        created_by: z.union([z.string(), z.number()]).optional(),
    });
}

type MuzeBoxValues = z.infer<ReturnType<typeof createFormSchema>>;

interface MuzeBoxFormProps {
    mode: "add" | "edit";
    defaultValues?: Partial<MuzeBoxValues> & { id?: string };
    onSuccess?: () => void;
}

export default function MuzeBoxEpisodeForm({ mode, defaultValues }: MuzeBoxFormProps) {
    const formSchema = createFormSchema(mode);

    const form = useForm<MuzeBoxValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
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
            console.error(error);
        }
    }, [form]);

    const { muzeBoxCreateMutation, isPending } = useMuzeBoxCreateCommand();
    const { muzeBoxTextUpdateMutation, isUpdateTextPending } =
        useMuzeBoxUpdateTextCommand();
    const { updateThumbnailMutation, isUpdateThumbnailPending } =
        useMuzeBoxUpdateThumbnailCommand();

    const onSubmit = async (values: MuzeBoxValues) => {
        try {
            if (mode === "add") {
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) => {
                    if (value === null || value === undefined) return;
                    else if (value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                });
                console.log("submitted value", values)
                // await muzeBoxCreateMutation(formData);
                form.reset();
            } else {
                if (!defaultValues?.id) throw new Error("ID missing");
                const isThumbnailUpdated =
                    values.thumbnail instanceof File ||
                    values.video instanceof File;
                const type =
                    values.thumbnail instanceof File ? "vertical" : "horizontal";

                if (isThumbnailUpdated) {
                    // Update Thumbnails (Multipart/FormData)
                    const thumbData = new FormData();
                    if (values.thumbnail instanceof File) {
                        thumbData.append("thumbnail", values.thumbnail);
                    }
                    if (values.video instanceof File) {
                        thumbData.append(
                            "video",
                            values.video,
                        );
                    }

                    await updateThumbnailMutation({
                        muzeBoxId: Number(defaultValues?.id),
                        type: type,
                        data: thumbData,
                    });
                    form.reset();
                }

                const textPayload = {
                    name: values.name,
                    description: values.description,
                    price: values.price,
                };
                // await muzeBoxTextUpdateMutation({
                //   id: Number(defaultValues?.id),
                //   data: textPayload,
                // });
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 border rounded-xl shadow-sm">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                    {/* HEADER */}
                    <div className="border-b pb-4">
                        <h2 className="text-2xl font-bold">
                            {mode === "add" ? "Create New Episode" : "Edit Episode"}
                        </h2>
                    </div>

                    <div className="space-y-6 max-w-sm mx-auto ">
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
                        {/* LEFT */}


                        {/* RIGHT */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* NAME */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <Input {...field} placeholder="Enter name..." />
                                        </FormItem>
                                    )}
                                />

                                {/* AGE RATING */}
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <Input
                                                placeholder="Enter price..."
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <Textarea {...field} placeholder="Enter description..." />
                                    </FormItem>
                                )}
                            />


                            {/* HORIZONTAL THUMBNAIL */}
                            <FormField
                                control={form.control}
                                name="video"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                fieldType="video"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {/* <DragAndDrop
                                fieldKey="video"
                                control={form.control}
                                setValue={form.setValue}
                                setFile={setVideoFile}
                                currentFile={videoFile}
                            /> */}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 pt-6 border-t flex-1 items-center justify-baseline">
                        <Button
                            className="w-full flex-1 cursor-pointer"
                            type="button"
                            variant="outline"
                            onClick={() => router.navigate("/entertainment/novel")}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="w-full flex-1 cursor-pointer"
                            disabled={
                                isPending || isUpdateTextPending || isUpdateThumbnailPending
                            }
                        >
                            {(isPending ||
                                isUpdateTextPending ||
                                isUpdateThumbnailPending) && <Spinner />}
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
