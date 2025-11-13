"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2, MapPin } from "lucide-react"
import { Polygon } from "@/types/map.types"

interface PolygonListProps {
  polygons: Polygon[]
  selectedPolygonId: string | null
  onSelectPolygon: (id: string | null) => void
  onDeletePolygon: (id: string) => void
  onUpdatePolygon: (id: string, updates: Partial<Polygon>) => void
}

export default function PolygonList({
  polygons,
  selectedPolygonId,
  onSelectPolygon,
  onDeletePolygon,
  onUpdatePolygon,
}: PolygonListProps) {
  const [editingPolygon, setEditingPolygon] = useState<Polygon | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editColor, setEditColor] = useState("")
  const [deletePolygon, setDeletePolygon] = useState<Polygon | null>(null)

  // ✏️ Tahrirlash boshlanishi
  const handleEdit = (polygon: Polygon) => {
    setEditingPolygon(polygon)
    setEditName(polygon.name)
    setEditDescription(polygon.description || "")
    setEditColor(polygon.color)
  }

  // 💾 Saqlash
  const handleSave = () => {
    if (editingPolygon) {
      const updatedPolygon = {
        ...editingPolygon,
        name: editName,
        description: editDescription,
        color: editColor,
      }
      onUpdatePolygon(editingPolygon.id, updatedPolygon)

      // ✅ LocalStorage yangilash
      const stored = localStorage.getItem("polygons")
      const polygons = stored ? JSON.parse(stored) : []
      const updated = polygons.map((p: Polygon) =>
        p.id === editingPolygon.id ? updatedPolygon : p
      )
      localStorage.setItem("polygons", JSON.stringify(updated))

      setEditingPolygon(null)
    }
  }

  // 🗑 Tasdiqlangan o‘chirish
  const confirmDelete = (id?: string) => {
    if (!id) return
    onDeletePolygon(id)
  
    const stored = localStorage.getItem("polygons")
    const polygons = stored ? JSON.parse(stored) : []
    const updated = polygons.filter((p: Polygon) => p.id !== id)
    localStorage.setItem("polygons", JSON.stringify(updated))
  
    setDeletePolygon(null)
  }
  

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Polygonlar ({polygons.length})
        </h2>
      </div>

      {/* 🗺 Agar polygon yo‘q bo‘lsa */}
      {polygons.length === 0 ? (
        <Card className="p-8 text-center bg-muted/50">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground mb-1">
            Hali polygonlar yo‘q
          </p>
          <p className="text-xs text-muted-foreground">
            Xaritada chizishni boshlang
          </p>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {polygons.map((polygon) => (
            <Card
              key={polygon.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedPolygonId === polygon.id ? "border-primary" : ""
              }`}
              onClick={() => onSelectPolygon(polygon.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: polygon.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {polygon.name}
                  </h3>
                  {polygon.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {polygon.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{polygon.area.toFixed(2)} km²</span>
                    <span>•</span>
                    <span>{polygon.coordinates.length} nuqta</span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(polygon)
                    }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeletePolygon(polygon)
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ✏️ Tahrirlash oynasi */}
      <Dialog open={!!editingPolygon} onOpenChange={() => setEditingPolygon(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Polygonni tahrirlash</DialogTitle>
            <DialogDescription>
              Polygon nomi, tavsifi va rangini o‘zgartiring
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Polygon nomi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Tavsif (ixtiyoriy)</Label>
              <Textarea
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Polygon haqida ma'lumot"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Rang</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPolygon(null)}>
              Bekor qilish
            </Button>
            <Button onClick={handleSave}>Saqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🗑 O‘chirish tasdiqlash modali */}
      <AlertDialog open={!!deletePolygon} onOpenChange={() => setDeletePolygon(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Polygonni o‘chirish</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium">{deletePolygon?.name}</span> nomli polygonni o‘chirishni tasdiqlaysizmi?
              Bu amalni qaytarib bo‘lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => confirmDelete(deletePolygon?.id)}
            >
              Ha, o‘chirilsin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
