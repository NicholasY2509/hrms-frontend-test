"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  SmartPhone01Icon,
  Edit01Icon,
  Delete01Icon,
  Loading03Icon,
  Add01Icon,
  ComputerIcon,
  FingerPrintIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  useEmployeeDetails,
  useUpdateEmployeeDetails,
} from "../../../hooks/use-employee-detail"
import { DetailTabContainer } from "./detail-tab-container"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  attendanceUserSchema,
  AttendanceUserFormValues,
} from "../../../schemas"
import { EmployeeAttendanceUser } from "../../../types"
import { useZktecoMachines } from "@/modules/attendance/zkteco/hooks/use-zkteco"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AttendanceUserTabProps {
  employeeId: string | number
}

export function AttendanceUserTab({ employeeId }: AttendanceUserTabProps) {
  const { items, isLoading, mutate } = useEmployeeDetails(
    employeeId,
    "attendance-user"
  )
  const { update, isLoading: isUpdating } = useUpdateEmployeeDetails(
    employeeId,
    "attendance-user"
  )

  const { machines, isLoading: isLoadingMachines } = useZktecoMachines()

  const [isOpen, setIsOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<number | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttendanceUserFormValues>({
    resolver: zodResolver(attendanceUserSchema),
    defaultValues: {
      uid: 0,
      zkteco_machine_id: undefined,
    },
  })

  const handleAdd = () => {
    setEditingId(null)
    reset({
      uid: 0,
      zkteco_machine_id: undefined,
    })
    setIsOpen(true)
  }

  const handleEdit = (item: EmployeeAttendanceUser) => {
    setEditingId(item.id)
    reset({
      uid: item.uid,
      zkteco_machine_id: item.zkteco_machine_id,
    })
    setIsOpen(true)
  }

  const onSubmit = async (data: AttendanceUserFormValues) => {
    try {
      const normalize = (item: any) => ({
        id: item.id || null,
        uid: item.uid,
        zkteco_machine_id: item.zkteco_machine_id,
      })

      let updatedItems
      if (editingId) {
        updatedItems = items.map((item: any) =>
          item.id === editingId ? { ...data, id: editingId } : item
        )
      } else {
        updatedItems = [...items, { ...data }]
      }

      const payload = updatedItems.map(normalize)
      await update(payload)
      setIsOpen(false)
      mutate()
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleDeleteRequest = (id: number) => {
    setDeletingId(id)
    setIsConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      const normalize = (item: any) => ({
        id: item.id || null,
        uid: item.uid,
        zkteco_machine_id: item.zkteco_machine_id,
      })

      const updatedItems = items.filter((item: any) => item.id !== deletingId)
      const payload = updatedItems.map(normalize)
      await update(payload)
      mutate()
    } catch (error) {
      // Error handled by hook
    }
  }

  return (
    <DetailTabContainer
      title="User Presensi ZKTeco"
      icon={FingerPrintIcon}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      extra={
        <Button size="sm" className="gap-2" onClick={handleAdd}>
          <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
          Tambah Akses Mesin
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item: EmployeeAttendanceUser) => (
          <div
            key={item.id}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/20"
          >
            <div className="flex items-start justify-between">
              <div className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-amber-600">
                <HugeiconsIcon icon={ComputerIcon} className="h-4 w-4" />
                <span className="text-[11px] font-bold tracking-widest uppercase">
                  ID Mesin: {item.zkteco_machine_id}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => handleEdit(item)}
                >
                  <HugeiconsIcon icon={Edit01Icon} className="h-3.5 w-3.5" />
                </Button>
                {item.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => handleDeleteRequest(item.id!)}
                  >
                    <HugeiconsIcon
                      icon={Delete01Icon}
                      className="h-3.5 w-3.5"
                    />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                USER UID
              </p>
              <h4 className="font-mono text-2xl leading-none font-extrabold text-foreground">
                {item.uid}
              </h4>
              {item.machine && (
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  Mesin: {item.machine.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Akses Mesin" : "Tambah Akses Mesin"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            <Controller
              name="uid"
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel required>UID User (ZKTeco)</FieldLabel>
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="Masukkan UID dari mesin"
                    type="number"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="zkteco_machine_id"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel required>Mesin Absensi</FieldLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(Number(val))}
                    disabled={isLoadingMachines}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mesin absensi" />
                    </SelectTrigger>
                    <SelectContent>
                      {machines.map((machine) => (
                        <SelectItem
                          key={machine.id}
                          value={machine.id.toString()}
                        >
                          {machine.name} ({machine.ip_address})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.zkteco_machine_id?.message]} />
                </Field>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={isUpdating}
              >
                Batal
              </Button>
              <Button type="submit" className="gap-2" disabled={isUpdating}>
                {isUpdating ? (
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    className="h-4 w-4 animate-spin"
                  />
                ) : editingId ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Akses"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Akses Mesin"
        description="Apakah Anda yakin ingin menghapus akses mesin ZKTeco ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        variant="destructive"
        isLoading={isUpdating}
      />
    </DetailTabContainer>
  )
}
