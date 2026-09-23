"use client"

import { useState } from "react"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import type { UploadedImage } from "./image-uploader"
import type { InspectionResult } from "@/lib/inspection"
import { ScanningOverlay } from "./scanning-overlay"
import { DetectionOverlay } from "./detection-overlay"
import { HeatmapView } from "./heatmap-view"
import { MaskOverlay } from "./mask-overlay"

export type ViewTab = "ORIGINAL" | "DETECTION" | "HEATMAP" | "MASK"
export type Phase = "idle" | "processing" | "done"

const TABS: ViewTab[] = ["ORIGINAL", "DETECTION", "HEATMAP", "MASK"]

interface ImageViewerProps {
  image: UploadedImage
  phase: Phase
  result: InspectionResult | null
  activeTab: ViewTab
  onTabChange: (tab: ViewTab) => void
}

export function ImageViewer({ image, phase, result, activeTab, onTabChange }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1)

  const showTabs = phase === "done" && result
  const scanning = phase === "processing"

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Inspection Image
        </span>
        <div className="flex items-center gap-1">
          <IconBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}>
            <ZoomOut className="h-4 w-4" />
          </IconBtn>
          <span className="w-10 text-center font-mono text-[11px] tabular-nums text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <IconBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}>
            <ZoomIn className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Reset zoom" onClick={() => setZoom(1)}>
            <Maximize2 className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>

      {/* Tabs */}
      {showTabs && (
        <div className="flex gap-1 rounded-lg border border-border bg-panel p-1">
          {TABS.map((tab) => {
            const active = tab === activeTab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`relative flex-1 rounded-md px-2 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors ${
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {active && <span className="absolute inset-0 rounded-md bg-primary" />}
                <span className="relative">{tab}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Image stage */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-[#05070c]">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src || "/placeholder.svg"}
            alt="Industrial component under inspection"
            className="h-full w-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
            crossOrigin="anonymous"
          />
        </div>

        {scanning && result && <ScanningOverlay featurePoints={result.featurePoints} />}

        {showTabs && activeTab === "DETECTION" && <DetectionOverlay result={result} />}
        {showTabs && activeTab === "HEATMAP" && <HeatmapView blobs={result.heatBlobs} />}
        {showTabs && activeTab === "MASK" && <MaskOverlay result={result} />}

        {/* Demo watermark */}
        <div className="absolute bottom-2 right-2 rounded bg-background/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
          Demo
        </div>
      </div>

      {/* Filename + dimensions */}
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-muted-foreground">
        <span className="max-w-[60%] truncate">{image.name}</span>
        {image.width > 0 && (
          <span className="tabular-nums">
            {image.width} × {image.height} px
          </span>
        )}
      </div>
    </div>
  )
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      {children}
    </button>
  )
}
