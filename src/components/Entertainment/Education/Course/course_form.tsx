"use client";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import ImageUpload from "@/components/common/image_upload";

import { decryptAuthData } from "@/lib/helper";

import { useTranslation } from "react-i18next";
import { useBlocker, useNavigate } from "react-router-dom";
import NavigateConfirmDialog from "@/components/common/navigate_confirm_dialog";
import RequiredLabel from "../../../common/required_label";
import { Spinner } from "../../../ui/spinner";
import ConfirmCard from "../../../common/confirm_card";
import { useCourseCreateCommand } from "../../../../composable/Command/Entertainment/Education/Course/useCourseCreateCommand";
import { useTextUpdateCommand } from "../../../../composable/Command/Entertainment/Education/Course/useTextUpdateCommand";
import { useThumbnailUpdateCommand } from "../../../../composable/Command/Entertainment/Education/Course/useThumbnailUpdateCommand";
import { usePdfUpdateCommand } from "../../../../composable/Command/Entertainment/Education/Course/usePdfUpdateCommand";

function createFormSchema(mode: "add" | "edit") {
    const imageSchema =
        mode === "add"
            ? z.custom<File>((val) => val instanceof File, "Image is required")
            : z.union([z.instanceof(File), z.string()]).optional();

    return z.object({
        name: z.string().min(1, "Name is required."),
        price: z.number().min(0, "Price must be 0 or greater"),

        thumbnail: imageSchema,
        grade_id: z.union([z.string(), z.number()]),
        file_path: z.union([z.instanceof(File), z.string()]).optional(),

        createdBy: z.union([z.string(), z.number()]).optional(),
    });
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface FormProps {
    mode: "add" | "edit";
    grade_id: string | number;
    defaultValues?: Partial<FormValues> & { id?: string | number };
    onSuccess?: () => void;
}

export default function CourseForm({ mode, defaultValues, grade_id }: FormProps) {
    const storedData = localStorage.getItem("creator");
    const loginCreator = storedData ? decryptAuthData(storedData) : null;
    const creatorId = loginCreator?.creator?.id || "";

    const resetToken = useRef(defaultValues?.id);

    const formSchema = createFormSchema(mode);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const navigate = useNavigate();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            name: defaultValues?.name || "",
            price: defaultValues?.price || 0,
            thumbnail: defaultValues?.thumbnail || undefined,
            grade_id: Number(grade_id),
            file_path: defaultValues?.file_path || undefined,
            createdBy: creatorId,
        },
    });


    useEffect(() => {
        if (
            mode === "edit" &&
            defaultValues &&
            defaultValues.id !== resetToken.current
        ) {
            form.reset({
                ...defaultValues,
                createdBy: creatorId,
            });
            resetToken.current = defaultValues.id;
        } else if (mode === "add") {
            // form.setValue("created_by", creatorId);
        }
    }, [form, defaultValues, mode, creatorId]);



    const { courseCreateMutation, isPending } = useCourseCreateCommand();
    const { textUpdateMutation, isPending: isUpdatingText } = useTextUpdateCommand();
    const { thumbnailUpdateMutation, isUpdatingThumbnail } = useThumbnailUpdateCommand();
    const { updatePdfMutation, isPending: isUpdatingPdf } = usePdfUpdateCommand();

    const { isDirty, isSubmitting, isSubmitSuccessful } = form.formState;

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isDirty &&
            !isSubmitting && // Don't block while mutation is running
            !isSubmitSuccessful && // Don't block if we just finished successfully
            currentLocation.pathname !== nextLocation.pathname,
    );

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    const onSubmit = async (values: FormValues) => {
        try {
            if (mode === "add") {
                const formData = new FormData();
                formData.append("grade_id", String(values.grade_id));
                Object.entries(values).forEach(([key, value]) => {
                    if (value === null || value === undefined) return;
                    if (key === "generes" && Array.isArray(value)) {
                        value.forEach((g) => formData.append("generes", g));
                    } else if (value instanceof File) {
                        formData.append(key, value);
                    } else {
                        formData.append(key, String(value));
                    }
                });
                await courseCreateMutation(formData);
                form.reset();
            } else {
                if (!defaultValues?.id) throw new Error("ID missing");
                const isThumbnailUpdated =
                    values.thumbnail instanceof File;

                const isPdfUpdated = values.file_path instanceof File;

                if (isThumbnailUpdated) {
                    // Update Thumbnails (Multipart/FormData)
                    const thumbData = new FormData();
                    if (values.thumbnail instanceof File) {
                        thumbData.append("thumbnail", values.thumbnail);
                    }
                    await thumbnailUpdateMutation({
                        courseId: Number(defaultValues?.id),
                        data: thumbData,
                    })
                }

                if (isPdfUpdated) {
                    // Update PDF (Multipart/FormData)
                    const pdfData = new FormData();
                    pdfData.append("file_path", values.file_path as File);
                    await updatePdfMutation({
                        courseId: Number(defaultValues?.id),
                        pdf: pdfData,
                    })
                }

                const textPayload = {
                    name: values.name,
                    price: values.price,
                    grade_id: Number(values.grade_id),
                    courseId: Number(defaultValues?.id),
                };
                await textUpdateMutation(textPayload);

                form.reset(values);
                navigate("/entertainment/education");
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const { t } = useTranslation();

    return (
        <div className="max-w-7xl mx-auto p-6 border rounded-xl shadow-sm">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                    {/* HEADER */}
                    <div className="border-b pb-4">
                        <h2 className="text-2xl font-bold">
                            {mode === "add" ? "Add Course" : "Edit Course"}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Fill in the information for your coourse.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* LEFT */}
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="thumbnail"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center">
                                        <FormLabel>
                                            <RequiredLabel label={t("thumbnail")} />
                                        </FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                                size="large"
                                            />
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
                                            <FormLabel>
                                                <RequiredLabel label={t("title")} />
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter title..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* PRICE */}
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                <RequiredLabel label={t("price")} />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(Number(e.target.value))
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="file_path"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>
                                                <RequiredLabel label={t("file_upload")} />
                                            </FormLabel>

                                            {/* Show existing file if editing */}
                                            {typeof field.value === "string" && mode === "edit" && (
                                                <div className="">
                                                    <a
                                                        href={field.value}
                                                        target="_blank"
                                                        className="text-primary underline"
                                                    >
                                                        View existing file
                                                    </a>
                                                </div>
                                            )}

                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 pt-6 border-t flex-1 items-center justify-baseline">
                        <Button
                            className="w-full flex-1 cursor-pointer"
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/entertainment/education")}
                        >
                            Cancel
                        </Button>
                        <AlertDialog open={confirmDialog} onOpenChange={setConfirmDialog}>
                            <Button
                                type="button"
                                className="flex-1 cursor-pointer"
                                onClick={async () => {
                                    const isValid = await form.trigger();

                                    if (isValid) {
                                        setConfirmDialog(true);
                                    } else {
                                        toast.error(
                                            "Please fill in all required fields correctly.",
                                        );
                                    }
                                }}
                            >
                                {(isPending ||
                                    isUpdatingText ||
                                    isUpdatingThumbnail ||
                                    isUpdatingPdf) && <Spinner className="mr-2 w-4 h-4" />}
                                {mode === "add" ? "Add Title" : "Save Changes"}
                            </Button>
                            <AlertDialogContent className="max-w-md">
                                <AlertDialogHeader>
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                        <CheckCircle2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <AlertDialogTitle className="text-center text-xl">
                                        Confirm {mode === "add" ? "Creation" : "Changes"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-center">
                                        Please review the details below before proceeding.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                {/* Review Card */}
                                <ConfirmCard
                                    name={form.getValues("name")}
                                    price={form.getValues("price")}
                                />

                                <AlertDialogFooter className="sm:justify-center gap-2">
                                    <AlertDialogCancel className="flex-1 cursor-pointer">
                                        Back to Edit
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={form.handleSubmit(onSubmit)}
                                        className="flex-1 cursor-pointer"
                                        disabled={
                                            isPending ||
                                            isUpdatingText ||
                                            isUpdatingThumbnail ||
                                            isUpdatingPdf
                                        }
                                    >
                                        {(isPending ||
                                            isUpdatingText ||
                                            isUpdatingThumbnail ||
                                            isUpdatingPdf) && <Spinner className="mr-2 w-4 h-4" />}
                                        Confirm & {mode === "add" ? "Add Course" : "Update Course"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <NavigateConfirmDialog blocker={blocker} />
                </form>
            </Form>
        </div>
    );
}
