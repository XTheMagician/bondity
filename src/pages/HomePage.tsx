import { useState } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
  Bell,
  Plus,
  Upload,
  Library,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  ShoppingBag,
  Printer,
  ChevronRight,
  DollarSign,
  Download,
  Star,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { FileCard } from "@/features/files/components/FileCard"
import type { OwnedFile, SavedFile } from "@/features/files/types"

// --- Dummy data ---

const notifications = [
  {
    id: 1,
    type: "order",
    message: "Your order #1042 was accepted by PrintMaster",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    type: "review",
    message: "New 5-star review on 'Dragon Figurine.stl'",
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    type: "sale",
    message: "Someone purchased 'Vase_v3.stl' for $4.99",
    time: "3h ago",
    read: true,
  },
  {
    id: 4,
    type: "order",
    message: "Order #1038 completed by 3DPro Studio",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    type: "system",
    message: "Your file 'Chess Set.stl' passed review and is now live",
    time: "2d ago",
    read: true,
  },
  {
    id: 6,
    type: "sale",
    message: "Someone purchased 'Dragon Figurine.stl' for $3.49",
    time: "3d ago",
    read: true,
  },
]

const activeOrders = [
  {
    id: "1042",
    file: "Dragon Figurine.stl",
    printer: "PrintMaster",
    status: "printing",
    price: 28.5,
    created: "May 2, 2026",
  },
  {
    id: "1045",
    file: "Custom Phone Stand.stl",
    printer: "—",
    status: "pending",
    price: 12.0,
    created: "May 3, 2026",
  },
]

const pastOrders = [
  {
    id: "1038",
    file: "Vase Collection Vol.2",
    printer: "3DPro Studio",
    status: "completed",
    price: 45.0,
    created: "Apr 28, 2026",
  },
  {
    id: "1031",
    file: "Miniature Set A",
    printer: "QuickPrint",
    status: "completed",
    price: 19.99,
    created: "Apr 15, 2026",
  },
  {
    id: "1024",
    file: "Desk Organizer",
    printer: "MakerSpace",
    status: "cancelled",
    price: 22.5,
    created: "Apr 3, 2026",
  },
]

type LibraryFile = OwnedFile | SavedFile

const libraryFiles: LibraryFile[] = [
  {
    id: "1",
    source: "uploaded",
    name: "Dragon Figurine.stl",
    preview_url: null,
    downloads: 142,
    earnings: 498.58,
    avg_rating: 4.8,
    review_count: 23,
    status: "published",
  },
  {
    id: "2",
    source: "uploaded",
    name: "Vase Collection Vol.2",
    preview_url: null,
    downloads: 89,
    earnings: 312.11,
    avg_rating: 4.6,
    review_count: 14,
    status: "published",
  },
  {
    id: "3",
    source: "uploaded",
    name: "Chess Set Complete",
    preview_url: null,
    downloads: 211,
    earnings: 739.89,
    avg_rating: 4.9,
    review_count: 47,
    status: "published",
  },
  {
    id: "4",
    source: "uploaded",
    name: "Phone Stand v3.stl",
    preview_url: null,
    downloads: 34,
    earnings: 59.66,
    avg_rating: 4.2,
    review_count: 8,
    status: "published",
  },
  {
    id: "5",
    source: "uploaded",
    name: "Desk Organizer Pro",
    preview_url: null,
    downloads: 0,
    earnings: 0,
    avg_rating: 0,
    review_count: 0,
    status: "draft",
  },
  {
    id: "6",
    source: "saved",
    name: "Articulated Snake.stl",
    preview_url: null,
    seller_username: "3DDesigns_Pro",
    saved_at: "May 1, 2026",
  },
  {
    id: "7",
    source: "saved",
    name: "Low-Poly Wolf",
    preview_url: null,
    seller_username: "PolyArtStudio",
    saved_at: "Apr 20, 2026",
  },
]

const stats = {
  totalEarnings: 1610.24,
  activeOrders: 2,
  totalFiles: 5,
  totalDownloads: 476,
}

// --- Helpers ---

function orderStatusBadge(status: string) {
  switch (status) {
    case "printing":
      return (
        <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Printer className="mr-1 size-3" />
          Printing
        </Badge>
      )
    case "pending":
      return (
        <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Clock className="mr-1 size-3" />
          Pending
        </Badge>
      )
    case "completed":
      return (
        <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="mr-1 size-3" />
          Completed
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
          <XCircle className="mr-1 size-3" />
          Cancelled
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function notificationIcon(type: string) {
  switch (type) {
    case "order":
      return <Package className="mt-0.5 size-4 shrink-0 text-blue-500" />
    case "review":
      return <Star className="mt-0.5 size-4 shrink-0 text-amber-500" />
    case "sale":
      return <DollarSign className="mt-0.5 size-4 shrink-0 text-emerald-500" />
    default:
      return <Bell className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
  }
}

// --- Sub-components ---

function NewOrderDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" />
          New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Start a new order</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <button
            className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Upload className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Upload a file</p>
              <p className="text-xs text-muted-foreground">
                Send a new .stl or .obj file to be printed
              </p>
            </div>
            <ChevronRight className="ml-auto size-4 text-muted-foreground" />
          </button>

          <button
            className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <Library className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Choose from my library</p>
              <p className="text-xs text-muted-foreground">
                Re-order a file you've uploaded before
              </p>
            </div>
            <ChevronRight className="ml-auto size-4 text-muted-foreground" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- Main Page ---

export default function HomePage() {
  const { user } = useAuth()
  const unreadCount = notifications.filter((n) => !n.read).length

  const firstName = user?.email?.split("@")[0] ?? "there"
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  const uploadedFiles = libraryFiles.filter(
    (f) => f.source === "uploaded"
  ) as OwnedFile[]
  const savedFiles = libraryFiles.filter(
    (f) => f.source === "saved"
  ) as SavedFile[]

  return (
    <div className="space-y-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your prints.
          </p>
        </div>
        <NewOrderDialog />
      </div>

      {/* Compact stats strip */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 rounded-lg border px-4 py-2.5 text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <TrendingUp className="size-3.5 text-emerald-500" />
          <span className="font-semibold text-foreground">
            $
            {stats.totalEarnings.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
          total earnings
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Package className="size-3.5 text-blue-500" />
          <span className="font-semibold text-foreground">
            {stats.activeOrders}
          </span>
          active orders
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <FileText className="size-3.5 text-violet-500" />
          <span className="font-semibold text-foreground">
            {stats.totalFiles}
          </span>
          files
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Download className="size-3.5 text-amber-500" />
          <span className="font-semibold text-foreground">
            {stats.totalDownloads}
          </span>
          downloads
        </span>
      </div>

      {/* Orders + Notifications */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Orders — 2/3 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Orders</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <Tabs defaultValue="active">
              <TabsList className="mb-3 h-8">
                <TabsTrigger value="active" className="text-xs">
                  Active
                  {activeOrders.length > 0 && (
                    <span className="ml-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                      {activeOrders.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="past" className="text-xs">
                  Past
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-2">
                {activeOrders.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <Package className="size-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      No active orders
                    </p>
                    <NewOrderDialog />
                  </div>
                ) : (
                  activeOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                          <FileText className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm leading-none font-medium">
                            {order.file}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            #{order.id} · {order.printer} · {order.created}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {orderStatusBadge(order.status)}
                        <span className="text-sm font-semibold">
                          ${order.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-2">
                {pastOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm leading-none font-medium">
                          {order.file}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          #{order.id} · {order.printer} · {order.created}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {orderStatusBadge(order.status)}
                      <span className="text-sm font-semibold">
                        ${order.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Notifications — 1/3 */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-1.5 py-0 text-[10px] text-muted-foreground"
                >
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <ScrollArea className="h-[280px]">
              <div className="flex flex-col">
                {notifications.map((notif, i) => (
                  <div key={notif.id}>
                    <div
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                        !notif.read && "bg-muted/30"
                      )}
                    >
                      {notificationIcon(notif.type)}
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-xs leading-snug",
                            !notif.read
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {notif.message}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                          {notif.time}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    {i < notifications.length - 1 && (
                      <Separator className="mx-4 w-auto" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Library */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">My Library</CardTitle>
            <Button size="sm">
              <Upload className="size-3.5" />
              Upload new file
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <Tabs defaultValue="uploaded">
            <TabsList className="mb-4 h-8">
              <TabsTrigger value="uploaded" className="text-xs">
                Uploaded by me
                <span className="ml-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {uploadedFiles.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-xs">
                Saved &amp; purchased
                {savedFiles.length > 0 && (
                  <span className="ml-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {savedFiles.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="uploaded">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {uploadedFiles.map((file) => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved">
              {savedFiles.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <ShoppingBag className="size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No saved files yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {savedFiles.map((file) => (
                    <FileCard key={file.id} file={file} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
