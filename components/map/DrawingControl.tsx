"use client"

import { useState, useEffect } from "react"
import { Polygon as PolygonType } from "@/types/map.types"
import { calculateArea, getRandomColor } from "./helpers"

export default function DrawingControl({
  polygons,
  selectedPolygonId,
  onPolygonsChange,
  onSelectPolygon,
  useMapEvents,
  Marker,
  Polygon,
  onDrawingChange,
}: {
  polygons: PolygonType[]
  selectedPolygonId: string | null
  onPolygonsChange: (polygons: PolygonType[]) => void
  onSelectPolygon: (id: string | null) => void
  useMapEvents: any
  Marker: any
  Polygon: any
  onDrawingChange: (isDrawing: boolean, points: [number, number][]) => void
}) {
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [tempPolygons, setTempPolygons] = useState<PolygonType[]>([])

  const map = useMapEvents({
    click(e: any) {
      if (!isDrawing) setIsDrawing(true)
      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng]
      const updatedPoints = [...currentPoints, newPoint]
      setCurrentPoints(updatedPoints)
      onDrawingChange(true, updatedPoints)
    },
  })

  // 🔹 LocalStorage’dagi o‘zgarishlarni kuzatamiz
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("polygons")
      const parsed: PolygonType[] = stored ? JSON.parse(stored) : []
      onPolygonsChange(parsed)
      setTempPolygons(parsed)
    }

    // Har safar localStorage yangilanganda ishga tushadi
    window.addEventListener("storage", handleStorageChange)

    // Birinchi yuklanishda localStorage’dagi polygonlarni yuklaymiz
    const stored = localStorage.getItem("polygons")
    if (stored) {
      const parsed: PolygonType[] = JSON.parse(stored)
      onPolygonsChange(parsed)
      setTempPolygons(parsed)
    }

    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // ✅ Yakunlash / Bekor / O‘chirish eventlarini tinglaymiz
  useEffect(() => {
    const finishHandler = () => confirmPolygon()
    const cancelHandler = () => cancelDrawing()
    const deleteHandler = () => deleteSelectedPolygon()

    document.addEventListener("finishPolygon", finishHandler)
    document.addEventListener("cancelPolygon", cancelHandler)
    document.addEventListener("deletePolygon", deleteHandler)

    return () => {
      document.removeEventListener("finishPolygon", finishHandler)
      document.removeEventListener("cancelPolygon", cancelHandler)
      document.removeEventListener("deletePolygon", deleteHandler)
    }
  }, [currentPoints, polygons, selectedPolygonId])

  // ✅ “Tasdiqlash” — polygonni localStorage + statega saqlaydi
  const confirmPolygon = async () => {
    if (currentPoints.length < 3) return

    const newPolygon: PolygonType = {
      id: Date.now().toString(),
      name: `Polygon ${polygons.length + 1}`,
      coordinates: currentPoints,
      color: getRandomColor(),
      area: calculateArea(currentPoints),
      createdAt: new Date().toISOString(),
    }

    const updated = [...polygons, newPolygon]
    onPolygonsChange(updated)
    onSelectPolygon(newPolygon.id)
    localStorage.setItem("polygons", JSON.stringify(updated))
    setTempPolygons(updated)

    setCurrentPoints([])
    setIsDrawing(false)
    onDrawingChange(false, [])
  }

  // ✅ “Bekor qilish” — faqat chizilayotgan liniyani tozalaydi
  const cancelDrawing = () => {
    setCurrentPoints([])
    setIsDrawing(false)
    onDrawingChange(false, [])
  }

  // ✅ “Delete” — tanlangan polygonni localStorage va state’dan o‘chiradi
  const deleteSelectedPolygon = () => {
    if (!selectedPolygonId) return
    const updated = polygons.filter((p) => p.id !== selectedPolygonId)
    onPolygonsChange(updated)
    localStorage.setItem("polygons", JSON.stringify(updated))
    setTempPolygons(updated)
    onSelectPolygon(null)
  }

  return (
    <>
      {/* 🔵 Chizilayotgan yangi polygon */}
      {currentPoints.map((point, index) => (
        <Marker key={index} position={point} />
      ))}
      {currentPoints.length >= 2 && (
        <Polygon
          positions={currentPoints}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.3,
            dashArray: "5, 5",
          }}
        />
      )}

      {/* 🟢 Saqlangan polygonlar */}
      {tempPolygons.map((polygon) => (
        <Polygon
          key={polygon.id}
          positions={polygon.coordinates}
          pathOptions={{
            color: polygon.color,
            fillColor: polygon.color,
            fillOpacity: 0.35,
            weight: selectedPolygonId === polygon.id ? 3 : 2,
          }}
          eventHandlers={{
            click: () => onSelectPolygon(polygon.id),
          }}
        />
      ))}
    </>
  )
}
