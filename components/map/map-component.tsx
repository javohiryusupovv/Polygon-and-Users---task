"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { Polygon as PolygonType } from "@/types/map.types";
import DrawingControl from "./DrawingControl";

export default function MapComponent(props: {
  polygons: PolygonType[];
  onPolygonsChange: (p: PolygonType[]) => void;
  onSelectPolygon: (id: string | null) => void;
  selectedPolygonId: string | null;
}) {
  const { polygons, onPolygonsChange, onSelectPolygon, selectedPolygonId } = props;
  const [leaflet, setLeaflet] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasPoints, setHasPoints] = useState(false);

  useEffect(() => {
    const initLeaflet = async () => {
      const L = (await import("leaflet")).default;

      // 🔧 Marker icon 404 xatosini to‘g‘rilash
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });

      const mod = await import("react-leaflet");
      setLeaflet(mod);
    };

    initLeaflet();
  }, []);

  if (!leaflet)
    return (
      <div className="h-[80vh] flex items-center justify-center text-muted-foreground">
        Xarita yuklanmoqda...
      </div>
    );

  const { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } = leaflet;

  const handleDrawingChange = (drawing: boolean, points: [number, number][]) => {
    setIsDrawing(drawing);
    setHasPoints(points.length >= 3);
  };

  return (
    <div className="relative w-full max-sm:h-[60vh] h-[85vh]">
      <MapContainer
        center={[41.2995, 69.2401]}
        zoom={12}
        className="w-full h-full rounded-lg shadow"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Drawing control */}
        <DrawingControl
          polygons={polygons}
          selectedPolygonId={selectedPolygonId}
          onPolygonsChange={onPolygonsChange}
          onSelectPolygon={onSelectPolygon}
          useMapEvents={useMapEvents}
          Marker={Marker}
          Polygon={Polygon}
          onDrawingChange={handleDrawingChange}
        />
      </MapContainer>

      {/* Xarita ostidagi boshqaruv tugmalari */}
      {isDrawing && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] flex gap-3">
          <Button
            disabled={!hasPoints}
            onClick={() => document.dispatchEvent(new CustomEvent("finishPolygon"))}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Tasdiqlash
          </Button>
          <Button
            variant="outline"
            onClick={() => document.dispatchEvent(new CustomEvent("cancelPolygon"))}
          >
            <X className="w-4 h-4 mr-2" />
            Bekor qilish
          </Button>
        </div>
      )}
    </div>
  );
}
