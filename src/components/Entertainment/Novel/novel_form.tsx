"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/common/image_upload";

import { useGenresQuery } from "@/composable/Query/Genre/useGenresQuery";
import { decryptAuthData } from "@/lib/helper";
import router from "@/router/routes";

function createFormSchema(mode: "add" | "edit") {
    const imageSchema =
        mode === "add"
            ? z.custom<File>((val) => val instanceof File, "Image is required")
            : z.union([z.instanceof(File), z.string()]).optional();

    return z.object({
        name: z.string().min(1, "Name is required."),
        description: z.string().min(1, "Description is required"),
        price: z.number().min(0, "Price must be 0 or greater"),

        age_rating: z.number().min(0).optional(),
        preview: z.number().min(0).optional(),
        genres: z.array(z.string()).min(1, "Select at least one genre"),

        thumbnail: imageSchema,
        horizontal_thumbnail: imageSchema,

        file_path: z.union([z.instanceof(File), z.string()]).optional(),

        created_by: z.union([z.string(), z.number()]).optional(),
    });
}

type NovelFormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface NovelFormProps {
    mode: "add" | "edit";
    defaultValues?: Partial<NovelFormValues> & { id?: string };
    onSuccess?: () => void;
}

export default function NovelForm({
    mode,
    defaultValues,
    onSuccess,
}: NovelFormProps) {
    const formSchema = createFormSchema(mode);
    const { genresList } = useGenresQuery();

    const form = useForm<NovelFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            description: defaultValues?.description || "",
            genres: defaultValues?.genres || [],
            price: defaultValues?.price || 0,
            age_rating: defaultValues?.age_rating || 0,
            preview: defaultValues?.preview || 0,
            thumbnail: defaultValues?.thumbnail || undefined,
            horizontal_thumbnail:
                defaultValues?.horizontal_thumbnail || undefined,

            file_path: defaultValues?.file_path || undefined,

            created_by: "",
        },
    });

    useEffect(() => {
        if (defaultValues) {
            form.reset({
                name: defaultValues.name || "",
                description: defaultValues.description || "",
                price: defaultValues.price ?? 0,
                age_rating: defaultValues.age_rating ?? 0,
                genres: defaultValues.genres || [],
                preview: defaultValues.preview ?? 0,
                thumbnail: defaultValues.thumbnail,
                horizontal_thumbnail: defaultValues.horizontal_thumbnail,
                file_path: defaultValues.file_path,

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


    const onSubmit = async (values: NovelFormValues) => {
        try {
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (value === null || value === undefined) return;

                if (key === "genres" && Array.isArray(value)) {
                    value.forEach((g) => formData.append("genres", g));
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            });

            // await titleMutation(formData);
            if (mode === "add") {
                console.log("values", values)
                console.log("form data", formData)
            }
            if (onSuccess) onSuccess();
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
                            {mode === "add" ? "Create New Novel" : "Edit Novel"}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT */}
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="thumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail</FormLabel>
                                        <FormControl>
                                            <ImageUpload value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
                                            <Input {...field} />
                                        </FormItem>
                                    )}
                                />

                                {/* PRICE */}
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />

                                {/* AGE RATING */}
                                <FormField
                                    control={form.control}
                                    name="age_rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Age Rating</FormLabel>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="preview"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preview</FormLabel>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />

                                {/* FILE UPLOAD */}
                                <FormField
                                    control={form.control}
                                    name="file_path"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>File Upload</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="w-full"
                                                    type="file"
                                                    onChange={(e) =>
                                                        field.onChange(e.target.files?.[0])
                                                    }
                                                />
                                            </FormControl>
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
                                        <Textarea {...field} />
                                    </FormItem>
                                )}
                            />

                            {/* GENRES */}
                            <FormField
                                control={form.control}
                                name="genres"
                                render={({ field }) => {
                                    const toggleGenre = (id: string) => {
                                        const exists = field.value.includes(id);
                                        if (exists) {
                                            field.onChange(field.value.filter((g) => g !== id));
                                        } else {
                                            field.onChange([...field.value, id]);
                                        }
                                    };

                                    return (
                                        <FormItem>
                                            <FormLabel>Genres</FormLabel>
                                            <div className="flex flex-wrap gap-2 border p-4 rounded-lg">
                                                {genresList?.map((g: any) => {
                                                    const selected = field.value.includes(
                                                        g.id.toString()
                                                    );

                                                    return (
                                                        <Badge
                                                            key={g.id}
                                                            variant={selected ? "default" : "outline"}
                                                            onClick={() => toggleGenre(g.id.toString())}
                                                            className="cursor-pointer flex items-center gap-1"
                                                        >
                                                            {g.name}
                                                            {selected && <CheckCircle2 size={14} />}
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                            {/* HORIZONTAL THUMBNAIL */}
                            <FormField
                                control={form.control}
                                name="horizontal_thumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Horizontal Thumbnail</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 pt-6 border-t flex-1 items-center justify-baseline">
                        <Button
                            className="w-full flex-1 cursor-pointer"
                            type="button"
                            variant="outline"
                            onClick={() => router.navigate("/entertainment/comics")}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" className="w-full flex-1 cursor-pointer">
                            {/* {(isPending || isUpdatePending || isThumbnailPending) && <Spinner />} */}
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}