import { useState } from "react"
import { usePrinters } from "../hooks/usePrinters"
import { assignJobTarget } from "@/features/jobs/services/jobService"
import type { PrinterFilters, PrinterSort } from "../types"
import { Button } from "@/components/ui/button"

type Props = {
  jobId: string
  onChoose?: () => void
}

export default function PrinterList({ jobId, onChoose }: Props) {
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState<PrinterFilters>({})
  const [sort, setSort] = useState<PrinterSort | undefined>(undefined)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data, isLoading, isError, error } = usePrinters({
    filters,
    sort,
    page,
  })

  const printers = data?.data ?? []
  const total = data?.count ?? 0
  const totalPages = Math.ceil(total / 10)

  function updateFilters(patch: Partial<PrinterFilters>) {
    setPage(0)
    setSelectedIds(new Set())
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  function togglePrinter(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleSubmit(type: "open" | "specific") {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await assignJobTarget(
        jobId,
        type === "specific"
          ? { type: "specific", printerIds: [...selectedIds] }
          : { type: "open", filters: { minRating: filters.minRating } }
      )
      onChoose?.()
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      <h2 className="mb-4 text-xl font-semibold">Available Printers</h2>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-sm">Min rating:</label>
        <select
          className="rounded border px-2 py-1 text-sm"
          value={filters.minRating ?? ""}
          onChange={(e) =>
            updateFilters({
              minRating:
                e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
        >
          <option value="">Any</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="4.5">4.5+</option>
        </select>

        <label className="text-sm">Sort:</label>
        <select
          className="rounded border px-2 py-1 text-sm"
          value={sort?.by ?? ""}
          onChange={(e) => {
            setPage(0)
            setSort(
              e.target.value === "rating"
                ? { by: "rating", direction: "desc" }
                : undefined
            )
          }}
        >
          <option value="">Default</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading...</p>}
      {isError && <p className="text-destructive">{error.message}</p>}
      {submitError && <p className="text-destructive">{submitError}</p>}

      {!isLoading && !isError && printers.length === 0 && (
        <p className="text-muted-foreground">No printers found.</p>
      )}

      <ul className="divide-y rounded-md border">
        {printers.map((printer) => (
          <li key={printer.id} className="flex items-start gap-3 p-4">
            <input
              type="checkbox"
              className="mt-1"
              checked={selectedIds.has(printer.id)}
              onChange={() => togglePrinter(printer.id)}
            />
            <div className="flex flex-1 items-start justify-between">
              <div>
                <p className="font-medium">
                  {printer.profiles?.full_name ?? "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {printer.model_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {printer.printer_materials.map((m) => m.material).join(", ")}
                </p>
              </div>
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
        <div className="mt-4 flex items-center justify-between">
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

      <div className="mt-4 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          disabled={submitting}
          onClick={() => handleSubmit("open")}
        >
          Invite everyone matching filters{total > 0 ? ` (${total})` : ""}
        </Button>
        <Button
          disabled={selectedIds.size === 0 || submitting}
          onClick={() => handleSubmit("specific")}
        >
          Invite selected ({selectedIds.size})
        </Button>
      </div>
    </div>
  )
}
