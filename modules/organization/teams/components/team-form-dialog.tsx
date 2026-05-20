"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { teamSchema, TeamFormValues } from "../schemas"
import { Team } from "../types"
import { useCreateTeam, useUpdateTeam } from "../hooks/use-team-mutation"
import { EmployeePicker } from "@/modules/employee/employee/components/employee-picker"

interface TeamFormDialogProps {
  isOpen: boolean
  onClose: () => void
  team?: Team | null
  onSuccess: () => void
}

export function TeamFormDialog({
  isOpen,
  onClose,
  team,
  onSuccess,
}: TeamFormDialogProps) {
  const isEdit = !!team
  const { createTeam, isLoading: isCreating } = useCreateTeam()
  const { updateTeam, isLoading: isUpdating } = useUpdateTeam()
  const isLoading = isCreating || isUpdating

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      team_head_id: null,
      work_location_id: 1,
    },
  })

  React.useEffect(() => {
    if (team) {
      reset({
        name: team.name,
        team_head_id: team.team_head_id,
        work_location_id: Number(team.work_location_id),
      })
    } else {
      reset({
        name: "",
        team_head_id: null,
        work_location_id: 1, // Default value
      })
    }
  }, [team, reset, isOpen])

  const onSubmit = async (data: TeamFormValues) => {
    const success = isEdit
      ? await updateTeam({ id: team!.id, data })
      : await createTeam(data)

    if (success) {
      onSuccess()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Ubah Tim" : "Tambah Tim"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name" required>
                  {" "}
                  Nama Tim
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  placeholder="Masukkan nama tim..."
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="team_head_id"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="team_head_id">Kepala Tim</FieldLabel>
                <EmployeePicker
                  value={field.value ?? null}
                  onChange={field.onChange}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="work_location_id"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="work_location_id" required>
                  Lokasi Kerja
                </FieldLabel>
                <WorkLocationPicker
                  value={field.value}
                  onChange={(val) =>
                    field.onChange(val === "all" ? 0 : Number(val))
                  }
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
