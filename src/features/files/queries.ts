import { getFile, listFiles } from "./services/fileService"
import type { ListParams } from "@/types"
import type { FileFilters, FileSort } from "./types"

export const fileQueries = {
  all: () => ["files"] as const,

  lists: () => [...fileQueries.all(), "list"] as const,

  list: (params: ListParams<FileFilters, FileSort>) => ({
    queryKey: [...fileQueries.lists(), params] as const,
    queryFn: () =>
      listFiles(params.filters, params.sort, params.page, params.pageSize),
  }),

  myList: (userId: string, params: ListParams<FileFilters, FileSort>) =>
    fileQueries.list({
      ...params,
      filters: { ...params.filters, ownerId: userId },
    }),

  detail: (fileId: string) => ({
    queryKey: [...fileQueries.all(), fileId] as const,
    queryFn: () => getFile(fileId),
  }),
}
