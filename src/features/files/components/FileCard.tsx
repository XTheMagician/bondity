import {
  DollarSign,
  Download,
  FileText,
  Pencil,
  Star,
  ShoppingCart,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { OwnedFile, SavedFile, BrowseFile } from "@/features/files/types"

type FileCardProps =
  | { file: OwnedFile; onEdit?: () => void }
  | { file: SavedFile }
  | { file: BrowseFile; onBuy?: () => void }

type OwnedProps = Extract<FileCardProps, { file: OwnedFile }>
type BrowseProps = Extract<FileCardProps, { file: BrowseFile }>

function isOwned(p: FileCardProps): p is OwnedProps {
  return p.file.source === "uploaded"
}

function isBrowse(p: FileCardProps): p is BrowseProps {
  return p.file.source === "browse"
}

export function FileCard(props: FileCardProps) {
  return (
    <div className="group relative flex flex-col gap-3 rounded-lg border p-3 transition-colors hover:border-border/80 hover:bg-muted/30">
      {/* Owned: edit button on hover */}
      {isOwned(props) && (
        <button
          className="absolute top-2 right-2 hidden cursor-pointer items-center gap-1 rounded-md border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground shadow-sm transition-colors group-hover:flex hover:bg-muted hover:text-foreground"
          onClick={props.onEdit}
        >
          <Pencil className="size-3" />
          Edit
        </button>
      )}

      {/* Thumbnail placeholder */}
      <div className="flex h-24 items-center justify-center rounded-md bg-muted">
        <FileText className="size-8 text-muted-foreground/30" />
      </div>

      <div className="flex flex-col gap-1">
        {/* Name row */}
        <div className="flex items-start justify-between gap-2 pr-6">
          <p className="text-sm leading-snug font-medium">{props.file.name}</p>

          {props.file.source === "uploaded" && (
            <Badge
              variant="secondary"
              className={cn(
                "shrink-0 text-[10px]",
                props.file.status === "published" && "text-muted-foreground"
              )}
            >
              {props.file.status}
            </Badge>
          )}

          {props.file.source === "browse" && (
            <span className="shrink-0 text-sm font-semibold text-foreground">
              ${props.file.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Seller line (saved & browse) */}
        {props.file.source === "saved" && (
          <p className="text-xs text-muted-foreground">
            by {props.file.seller_username} · saved {props.file.saved_at}
          </p>
        )}
        {props.file.source === "browse" && (
          <p className="text-xs text-muted-foreground">
            by {props.file.seller_username}
          </p>
        )}

        {/* Stats grid (owned published & browse) */}
        {props.file.source === "uploaded" &&
          props.file.status === "published" && (
            <div className="grid grid-cols-3 gap-1 pt-1">
              <div className="flex flex-col items-center gap-0.5 rounded-md bg-muted/60 py-1.5">
                <DollarSign className="size-3 text-emerald-500" />
                <span className="text-[11px] font-semibold">
                  ${props.file.earnings.toFixed(0)}
                </span>
              </div>
              <div className="flex flex-col items-center gap-0.5 rounded-md bg-muted/60 py-1.5">
                <Download className="size-3 text-blue-500" />
                <span className="text-[11px] font-semibold">
                  {props.file.downloads}
                </span>
              </div>
              <div className="flex flex-col items-center gap-0.5 rounded-md bg-muted/60 py-1.5">
                <Star className="size-3 text-amber-500" />
                <span className="text-[11px] font-semibold">
                  {props.file.avg_rating} ({props.file.review_count})
                </span>
              </div>
            </div>
          )}

        {props.file.source === "uploaded" && props.file.status === "draft" && (
          <p className="pt-1 text-[11px] text-muted-foreground">
            Not published yet
          </p>
        )}

        {isBrowse(props) && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <Star className="size-3 text-amber-500" />
                {props.file.avg_rating} ({props.file.review_count})
              </span>
              <span className="flex items-center gap-0.5">
                <Download className="size-3 text-blue-500" />
                {props.file.downloads}
              </span>
            </div>
            <Button
              size="sm"
              className="h-6 gap-1 px-2 text-[11px]"
              onClick={props.onBuy}
            >
              <ShoppingCart className="size-3" />
              Buy
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
