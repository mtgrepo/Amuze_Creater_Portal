"use client";

import { useEffect, useRef, useState } from "react";
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

import ImageUpload from "@/components/common/image_upload";

import { Spinner } from "@/components/ui/spinner";
import { decryptAuthData } from "@/lib/helper";

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

import ConfirmCard from "../../../common/confirm_card";
import RequiredLabel from "../../../common/required_label";
import { useBlocker, useNavigate } from "react-router-dom";
import NavigateConfirmDialog from "@/components/common/navigate_confirm_dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { useGradeCreateCommand } from "../../../../composable/Command/Entertainment/Education/Grades/useGradeCreateCommand";
import { useGradeTextUpdateCommand } from "../../../../composable/Command/Entertainment/Education/Grades/useGradeTextUpdateCommand";
import { useGradeThumbnailUpdateCommand } from "../../../../composable/Command/Entertainment/Education/Grades/useGradeThumbnailUpdateCommand";
import { useTranslation } from "react-i18next";

function createFormSchema(mode: "add" | "edit") {
    const imageSchema =
        mode === "add"
            ? z.instanceof(File, { message: "Image is required" })
            : z.union([z.instanceof(File), z.string()]).optional();

    return z.object({
        name: z.string().min(1, "Name is required."),
        thumbnail: imageSchema,
        is_old_question: z.boolean().optional(),
        created_by: z.union([z.string(), z.number()]).optional(),
    });
}

type TitleFormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface TitleFormProps {
    mode: "add" | "edit";
    defaultValues?: Partial<TitleFormValues> & { id?: string };
    onSuccess?: () => void;
}

const question_type = [
    { label: "Old Question", value: "true" },
    { label: "New Question", value: "false" },
]

export default function GradesForm({
    mode,
    defaultValues,
}: TitleFormProps) {
    const storedData = localStorage.getItem("creator");
    const loginCreator = storedData ? decryptAuthData(storedData) : null;
    const creatorId = loginCreator?.creator?.id || "";

    const resetToken = useRef(defaultValues?.id);
    const navigate = useNavigate();

    const formSchema = createFormSchema(mode);
    const { t } = useTranslation();

    const [createDialog, setCreateDialog] = useState(false);

    const form = useForm<TitleFormValues>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        values: mode === "edit" ? {
            name: defaultValues?.name || "",
            thumbnail: defaultValues?.thumbnail || undefined,
            is_old_question: defaultValues?.is_old_question || false,
        } : undefined,
        defaultValues: {
            name: defaultValues?.name || "",
            thumbnail: defaultValues?.thumbnail || undefined,
            is_old_question: defaultValues?.is_old_question || false,
            created_by: creatorId,
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
                created_by: creatorId,
            });

            resetToken.current = defaultValues.id;
        }
    }, [defaultValues, mode, creatorId, form]);

    const { isDirty, isSubmitting, isSubmitSuccessful } = form.formState;

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isDirty &&
            !isSubmitting &&
            !isSubmitSuccessful &&
            currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    const { createGradeMutation, isPending } = useGradeCreateCommand();
    const { updateGradeTextMutation, isPending: isUpdatePending } = useGradeTextUpdateCommand();
    const { updateGradeThumbnailMutation, isPending: isThumbnailPending } = useGradeThumbnailUpdateCommand();

    const onSubmit = async (values: TitleFormValues) => {
        try {
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (value === null || value === undefined) return;

                if (key === "is_old_question") {
                    formData.append("isOldQuestion", String(value));
                    return;
                }

                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            });

            if (mode === "add") {
                await createGradeMutation(formData);
            } else {
                if (!defaultValues?.id) throw new Error("ID missing");

                const isThumbnailUpdated =
                    values.thumbnail instanceof File


                if (isThumbnailUpdated) {
                    const thumbData = new FormData();
                    if (values.thumbnail instanceof File) {
                        thumbData.append("thumbnail", values.thumbnail);
                    }

                    await updateGradeThumbnailMutation({
                        gradeId: Number(defaultValues?.id),
                        data: thumbData,
                    });
                }

                await updateGradeTextMutation({ gradeId: Number(defaultValues?.id), name: values?.name });
            }
            form.reset();
            setCreateDialog(false);
            navigate("/entertainment/education");

        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 border rounded-xl shadow-sm">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-10"
                >
                    {/* HEADER */}
                    <div className="border-b pb-4">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {mode === "add" ? t('grade_form.create_title') : t('grade_form.update_title') }
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {t('grade_form.description')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* IMAGE */}
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

                        {/* NAME */}
                        <div className="grid grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            <RequiredLabel label={t("grade_form.grade")} />
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. G - 10"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_old_question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("grade_form.question_type")}</FormLabel>

                                        <FormControl>
                                            <Select
                                                value={field.value ? "true" : "false"}
                                                onValueChange={(val) => field.onChange(val === "true")}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Question Type" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {question_type.map((item) => (
                                                        <SelectItem key={item.value} value={item.value}>
                                                            {item.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                form.reset();
                                navigate("/entertainment/education");
                            }}
                        >
                            {t('cancel')}
                        </Button>

                        <Button
                            type="button"
                            className="flex-1"
                            onClick={async () => {
                                const valid = await form.trigger();
                                if (valid) setCreateDialog(true);
                                else toast.error("Please fill required fields");
                            }}
                        >
                            {(isPending || isThumbnailPending || isUpdatePending) && <Spinner className="mr-2 w-4 h-4" />}
                            {mode === "add" ? t('create') : t('update') }
                        </Button>
                    </div>

                    <AlertDialog open={createDialog} onOpenChange={setCreateDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                </div>

                                <AlertDialogTitle className="text-center">
                                    Confirm {mode === "add" ? "Creation" : "Changes"}
                                </AlertDialogTitle>

                                <AlertDialogDescription className="text-center">
                                    Please review before confirming.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <ConfirmCard name={form.watch("name")} />

                            <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={form.handleSubmit(onSubmit)}
                                    disabled={isPending || isThumbnailPending || isUpdatePending}
                                >
                                    Confirm
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <NavigateConfirmDialog blocker={blocker} />
                </form>
            </Form>
        </div>
    );
}