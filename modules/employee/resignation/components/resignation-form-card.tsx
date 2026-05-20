"use client";

import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { differenceInDays, format } from "date-fns";
import {
    resignationSchema,
    ResignationFormValues,
} from "../schemas/resignation-schema";
import { useCreateResignation } from "../hooks/use-resignation";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Send,
    AlertCircleIcon,
    Loading03Icon,
} from "@hugeicons/core-free-icons";
import { FileUpload } from "@/components/ui/file-upload";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { DatePicker } from "@/components/ui/date-picker";

interface ResignationFormCardProps {
    onSuccess: () => void;
}

export function ResignationFormCard({ onSuccess }: ResignationFormCardProps) {
    const router = useRouter();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingFormData, setPendingFormData] = useState<ResignationFormValues | null>(null);

    const { createResignation, isLoading: isCreating } = useCreateResignation({
        onSuccess: () => {
            onSuccess();
            reset();
            setIsConfirmOpen(false);
            setPendingFormData(null);
        },
    });

    const {
        control,
        handleSubmit,
        watch,
        reset,
    } = useForm<ResignationFormValues>({
        resolver: zodResolver(resignationSchema),
        defaultValues: {
            effective_date: "",
            reason: "",
        },
    });

    // Watch effective date to show warning if it's less than 30 days notice
    const watchedEffectiveDate = watch("effective_date");
    const isLessThan30Days = useMemo(() => {
        if (!watchedEffectiveDate) return false;
        const diff = differenceInDays(new Date(watchedEffectiveDate), new Date());
        return diff < 30;
    }, [watchedEffectiveDate]);

    const handlePreSubmit = (data: ResignationFormValues) => {
        setPendingFormData(data);
        setIsConfirmOpen(true);
    };

    const handleConfirmSubmit = async () => {
        if (!pendingFormData) return;
        await createResignation(pendingFormData);
    };

    return (
        <div className="space-y-6">
            <Card className="border border-border/40 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(handlePreSubmit)} className="space-y-6">
                        <FieldGroup>
                            <Controller
                                name="effective_date"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name} required>
                                            Tanggal Efektif Resign
                                        </FieldLabel>
                                        <DatePicker
                                            value={field.value ? new Date(field.value) : undefined}
                                            onChange={(date) => {
                                                if (date) {
                                                    field.onChange(format(date, "yyyy-MM-dd"));
                                                } else {
                                                    field.onChange("");
                                                }
                                            }}
                                            disabled={isCreating}
                                            placeholder="Pilih tanggal efektif"
                                            className="hover:border-primary/45 transition-colors focus-visible:ring-1"
                                        />
                                        <FieldError errors={[fieldState.error]} />

                                        {isLessThan30Days && (
                                            <div className="mt-2.5 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-800 dark:text-amber-500 leading-normal flex items-start gap-2 font-medium">
                                                <HugeiconsIcon icon={AlertCircleIcon} className="h-4 w-4 shrink-0 mt-0.5" />
                                                <span>
                                                    Sesuai aturan perusahaan, pengajuan disarankan minimal 30 hari sebelum
                                                    tanggal efektif. Harap pastikan tanggal ini telah disetujui sebelumnya oleh
                                                    atasan Anda.
                                                </span>
                                            </div>
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="reason"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name} required>
                                            Alasan Pengunduran Diri
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            id={field.name}
                                            placeholder="Jelaskan secara rinci alasan pengunduran diri Anda..."
                                            className="min-h-[140px] bg-background hover:border-primary/45 transition-colors resize-none leading-relaxed"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="attachment"
                                control={control}
                                render={({ field: { value, onChange }, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="attachment">
                                            Lampiran Surat Resign Resmi (Opsional)
                                        </FieldLabel>
                                        <FileUpload
                                            value={value}
                                            onChange={onChange}
                                            accept=".pdf,image/*"
                                            maxSize={5}
                                        />
                                        <FieldError errors={[fieldState.error]} />
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        <div className="flex justify-end gap-3 pt-5 border-t border-border/40">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => router.back()}
                                disabled={isCreating}
                                className="font-semibold"
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isCreating} className="gap-2 font-bold px-5">
                                {isCreating ? (
                                    <HugeiconsIcon icon={Loading03Icon} className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <HugeiconsIcon icon={Send} className="h-4 w-4" />
                                        Kirim Pengajuan
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Double Confirmation Modal before submitting */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmSubmit}
                title="Kirim Pengajuan Resign?"
                description="Tindakan ini bersifat formal dan resmi. Permohonan Anda akan diajukan ke atasan langsung dan HRD untuk proses offboarding."
                confirmText="Ya, Kirim Resmi"
                cancelText="Batal"
                variant="destructive"
                isLoading={isCreating}
            />
        </div>
    );
}
