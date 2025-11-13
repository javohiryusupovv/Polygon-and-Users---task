export interface Polygon {
    id: string
    name: string
    description?: string
    coordinates: [number, number][] // [lat, lng] pairs
    color: string
    area: number // in km²
    createdAt: string
  }
  