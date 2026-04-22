import { Button } from "@/components/ui/button"
import type { FallbackProps } from "react-error-boundary"

export default function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        "An unexpected error occurred."
      </p>
      <Button onClick={resetErrorBoundary} className="mt-6">
        Try again
      </Button>
    </div>
  )
}
