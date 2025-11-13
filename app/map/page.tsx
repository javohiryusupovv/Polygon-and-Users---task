"use client"

import { useState, useEffect } from "react"
import MapComponent from "@/components/map/map-component"
import { MapPin, Download, Upload, Trash2, Moon, Sun, Info, MoveLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import PolygonList from "@/components/map/polygon-list"
import StatsPanel from "@/components/map/stats-panel"
import { Polygon } from "@/types/map.types"
import { useRouter } from "next/navigation"

export default function Home() {
  const [polygons, setPolygons] = useState<Polygon[]>([])
  const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const router =useRouter()

  // Load polygons from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("map-polygons")
    if (stored) {
      try {
        setPolygons(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to load polygons:", e)
      }
    }

    // Check for dark mode preference
    const darkModeStored = localStorage.getItem("dark-mode")
    if (darkModeStored === "true") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Save polygons to localStorage
  useEffect(() => {
    if (polygons.length > 0) {
      localStorage.setItem("map-polygons", JSON.stringify(polygons))
    }
  }, [polygons])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("dark-mode", (!darkMode).toString())
  }

  const handleClearAll = () => {
    if (confirm("Barcha polygonlarni o'chirmoqchimisiz?")) {
      setPolygons([])
      setSelectedPolygonId(null)
      localStorage.removeItem("map-polygons")
    }
  }

  return (
    <>
        <Button onClick={()=> router.push("/")} className="mx-5 my-3"><MoveLeft/> Back menyu</Button>
        <div className="mg:h-screen h-full flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-balance">Maps</h1>
                <p className="text-sm text-muted-foreground">Polygonlar chizish va boshqarish</p>
            </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
            <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={polygons.length === 0}
                className="gap-2 bg-transparent"
            >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Tozalash</span>
            </Button>
            <Button variant="outline" size="sm" onClick={toggleDarkMode} className="gap-2 bg-transparent">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 xl:w-96 bg-card border-b lg:border-b-0 lg:border-r border-border overflow-y-auto flex flex-col">
            <div className="p-4 space-y-4 flex-1">
                <StatsPanel polygons={polygons} />

                <Card className="p-4 bg-muted/50">
                <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                    Xaritada polygon chizish uchun nuqtalarni ketma-ket bosing. Polygonni yakunlash uchun birinchi nuqtani
                    qayta bosing yoki "Finish" tugmasini bosing.
                    </p>
                </div>
                </Card>

                <PolygonList
                polygons={polygons}
                selectedPolygonId={selectedPolygonId}
                onSelectPolygon={setSelectedPolygonId}
                onDeletePolygon={(id) => {
                    setPolygons(polygons.filter((p) => p.id !== id))
                    if (selectedPolygonId === id) setSelectedPolygonId(null)
                }}
                onUpdatePolygon={(id, updates) => {
                    setPolygons(polygons.map((p) => (p.id === id ? { ...p, ...updates } : p)))
                }}
                />
            </div>
            </aside>

            {/* Map */}
            <main className="flex-1 relative">
            <MapComponent
                polygons={polygons}
                selectedPolygonId={selectedPolygonId}
                onPolygonsChange={setPolygons}
                onSelectPolygon={setSelectedPolygonId}
            />
            </main>
        </div>
        </div>
    </>
  )
}
