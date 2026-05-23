"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PositionHierarchyMatrix } from "@/modules/organization/position-hierarchy-matrix/types"
import { useDeletePositionHierarchyMatrix } from "@/modules/organization/position-hierarchy-matrix/hooks/use-position-hierarchy-matrix"

interface DeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  matrix: PositionHierarchyMatrix | null
}

export function DeleteMatrixDialog({
  isOpen,
  onClose,
  matrix,
}: DeleteDialogProps) {
  const { deleteMatrix, isLoading } = useDeletePositionHierarchyMatrix({
    onSuccess: onClose,
  })

  const handleDelete = () => {
    if (matrix) {
      deleteMatrix(matrix.id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will delete the matrix mapping for{" "}
            <strong>{matrix?.position?.name}</strong> reporting to{" "}
            <strong>{matrix?.supervisor_position?.name}</strong> in the{" "}
            {matrix?.department?.name} department. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

