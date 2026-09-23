import { ScanSearch } from "lucide-react"

export function NavBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
            <ScanSearch className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="leading-tight">
            <h1 className="font-mono text-sm font-semibold tracking-tight text-foreground">
              VISIONINSPECT<span className="text-primary">-X</span>
            </h1>
            <p className="text-[11px] text-muted-foreground">Industrial AI Visual Inspection</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[11px] font-medium tracking-wide text-success">SYSTEM READY</span>
        </div>
      </div>
    </header>
  )
}
