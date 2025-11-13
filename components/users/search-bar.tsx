"use client"

import { useUsersStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hook/useDebounce"

export function SearchBar() {
  const { setSearchQuery, setLoading } = useUsersStore()
  const [value, setValue] = useState("")

  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    setLoading(true)

    const t = setTimeout(() => {
      setSearchQuery(debouncedValue)
      setLoading(false)
    }, 300) // API bo‘lsa minimal delay

    return () => clearTimeout(t)
  }, [debouncedValue])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

      <Input
        placeholder="Search by name..."
        className="pl-10 pr-10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
