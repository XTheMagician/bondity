import { useEffect, useState } from "react"
import { getAvailablePrinters } from "../services/printerService"
import { Button } from "@/components/ui/button"

type Printer = {
  id: string
  location_city: string
  material_types: string[]
  price_per_hour: number
  profiles: { full_name: string; avg_rating: number } | null
}

export default function PrinterList() {
  const [printers, setPrinters] = useState<Printer[]>([])
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [minRating, setMinRating] = useState<number | undefined>(undefined)

  const PAGE_SIZE = 10

  useEffect(() => {
    setLoading(true)
    setError(null)
    getAvailablePrinters({ minRating }, page)
      .then(({ data, count }) => {
        setPrinters(data ?? [])
        setTotal(count ?? 0)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [page, minRating])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Available Printers</h2>

      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm">Min rating:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={minRating ?? ""}
          onChange={(e) => {
            setPage(0)
            setMinRating(e.target.value === "" ? undefined : Number(e.target.value))
          }}
        >
          <option value="">Any</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="4.5">4.5+</option>
        </select>
      </div>

      {loading && <p className="text-muted-foreground">Loading...</p>}
      {error && <p className="text-destructive">{error}</p>}

      {!loading && !error && printers.length === 0 && (
        <p className="text-muted-foreground">No printers found.</p>
      )}

      <ul className="divide-y border rounded-md">
        {printers.map((printer) => (
          <li key={printer.id} className="p-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{printer.profiles?.full_name ?? "Unknown"}</p>
              <p className="text-sm text-muted-foreground">{printer.location_city}</p>
              <p className="text-sm text-muted-foreground">
                {printer.material_types?.join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">${printer.price_per_hour}/hr</p>
              {printer.profiles?.avg_rating != null && (
                <p className="text-sm text-muted-foreground">
                  ★ {printer.profiles.avg_rating.toFixed(1)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
