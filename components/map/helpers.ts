export function getRandomColor(): string {
    const colors = [
      "#ef4444", "#f97316", "#f59e0b", "#eab308",
      "#84cc16", "#22c55e", "#10b981", "#14b8a6",
      "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
      "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  export function calculateArea(coordinates: [number, number][]): number {
    if (coordinates.length < 3) return 0
    let area = 0
    const R = 6371
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length
      const lat1 = (coordinates[i][0] * Math.PI) / 180
      const lat2 = (coordinates[j][0] * Math.PI) / 180
      const lon1 = (coordinates[i][1] * Math.PI) / 180
      const lon2 = (coordinates[j][1] * Math.PI) / 180
      area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2))
    }
    return Math.abs((area * R * R) / 2)
  }
  