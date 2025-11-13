"use client"

import { Card } from "@/components/ui/card"
import { Polygon } from "@/types/map.types"
import { MapPin, Maximize2, Layers } from "lucide-react"

interface StatsPanelProps {
  polygons: Polygon[]
}

export default function StatsPanel({ polygons }: StatsPanelProps) {
  const totalArea = polygons.reduce((sum, p) => sum + p.area, 0)
  const totalPoints = polygons.reduce((sum, p) => sum + p.coordinates.length, 0)

  return (
    <div className="grid grid-cols-3 gap-2">
      <Card className="p-3 bg-primary/5 border-primary/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Polygonlar</span>
          </div>
          <span className="text-2xl font-bold text-primary">{polygons.length}</span>
        </div>
      </Card>

      <Card className="p-3 bg-accent/5 border-accent/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Maydon</span>
          </div>
          <span className="text-2xl font-bold text-primary">{totalArea.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">km²</span>
        </div>
      </Card>

      <Card className="p-3 bg-chart-2/5 border-chart-2/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-chart-2" />
            <span className="text-xs text-muted-foreground">Nuqtalar</span>
          </div>
          <span className="text-2xl font-bold text-chart-2">{totalPoints}</span>
        </div>
      </Card>
    </div>
  )
}
