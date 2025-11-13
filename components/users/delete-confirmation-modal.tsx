"use client"

import { useState } from "react"
import type { User } from "@/lib/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Spinner } from "./spinner"

interface DeleteConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  user,
  onConfirm,
  isLoading,
}: DeleteConfirmationModalProps) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for deletion")
      return
    }

    setError("")
    await onConfirm()
    setReason("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setReason("")
      setError("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Delete User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {user?.firstName} {user?.lastName}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for deletion *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a reason for deleting this user..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError("")
              }}
              disabled={isLoading}
              className="min-h-24"
            />
            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading} variant="destructive" className="gap-2">
              {isLoading && <Spinner size="sm" />}
              Delete User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
