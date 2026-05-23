"use client"

import { useEffect } from "react"
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
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { PositionHierarchyMatrix } from "@/modules/organization/position-hierarchy-matrix/types"
import {
  positionHierarchyMatrixSchema,
  PositionHierarchyMatrixFormValues,
} from "@/modules/organization/position-hierarchy-matrix/schemas/position-hierarchy-matrix"
import {
  useCreatePositionHierarchyMatrix,
  useUpdatePositionHierarchyMatrix,
} from "@/modules/organization/position-hierarchy-matrix/hooks/use-position-hierarchy-matrix"

// Pickers
import { WorkLocationPicker } from "@/modules/organization/work-location/components/work-location-picker"
import { DepartmentPicker } from "@/modules/organization/department/components/department-picker"
import { WorkPositionPicker } from "@/modules/organization/work-position/components/work-position-picker"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  initialData: PositionHierarchyMatrix | null
}

export function PositionHierarchyMatrixDialog({
  isOpen,
  onClose,
  mode,
  initialData,
}: DialogProps) {
  const { createMatrix, isLoading: isCreating } =
    useCreatePositionHierarchyMatrix({ onSuccess: onClose })
  const { updateMatrix, isLoading: isUpdating } =
    useUpdatePositionHierarchyMatrix({ onSuccess: onClose })

  const { control, handleSubmit, reset, formState } =
    useForm<PositionHierarchyMatrixFormValues>({
      resolver: zodResolver(positionHierarchyMatrixSchema),
      defaultValues: {
        work_location_id: null,
        department_id: 0,
        work_position_id: 0,
        supervisor_work_position_id: 0,
      },
    })

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        reset({
          work_location_id: initialData.work_location_id,
          department_id: initialData.department_id,
          work_position_id: initialData.work_position_id,
          supervisor_work_position_id: initialData.supervisor_work_position_id,
        })
      } else {
        reset({
          work_location_id: null,
          department_id: 0,
          work_position_id: 0,
          supervisor_work_position_id: 0,
        })
      }
    }
  }, [isOpen, mode, initialData, reset])

  const onSubmit = async (data: PositionHierarchyMatrixFormValues) => {
    if (mode === "create") {
      await createMatrix(data)
    } else if (mode === "edit" && initialData) {
      await updateMatrix({ id: initialData.id, data })
    }
  }

  const isPending = isCreating || isUpdating

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add Matrix Mapping" : "Edit Matrix Mapping"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Controller
              name="work_location_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Location</FieldLabel>
                  <WorkLocationPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="All Locations (Global)"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="department_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Department</FieldLabel>
                  <DepartmentPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="work_position_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Subordinate Position</FieldLabel>
                  <WorkPositionPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="supervisor_work_position_id"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>
                    Reports To (Supervisor Position)
                  </FieldLabel>
                  <WorkPositionPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Mapping"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
