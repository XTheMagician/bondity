import type { Sort } from "@/types"

export const DEFAULT_PAGE_SIZE = 10

export function pageRange(page: number, pageSize = DEFAULT_PAGE_SIZE) {
  const from = page * pageSize
  const to = from + pageSize - 1
  return { from, to }
}

export function resolveSort<T extends string>(
  sort: Sort<T> | undefined,
  defaultField: T
) {
  return {
    field: sort?.by ?? defaultField,
    ascending: sort ? sort.direction === "asc" : false,
  }
}
