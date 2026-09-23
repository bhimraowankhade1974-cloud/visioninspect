"use client"

import type { HeatBlob } from "@/lib/inspection"

interface HeatmapViewProps {
  blobs: HeatBlob[]
}

/**
 * Demo heatmap: blue -> cyan -> yellow -> red, hottest at each blob center.
 * Rendered with additive blending so overlapping activations accumulate.
 */
export function HeatmapView({ blobs }: HeatmapViewProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
      {/* Cool base wash so the whole surface reads as "measured" */}
      <div className="absolute inset-0 bg-[#0b2a6b]/35 mix-blend-screen" />

      <div className="vx-fade-scale absolute inset-0">
        {blobs.map((b, i) => {
          const a = b.intensity
          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.r * 2}%`,
                height: `${b.r * 2}%`,
                background: `radial-gradient(circle, rgba(239,68,68,${a}) 0%, rgba(245,158,11,${a * 0.85}) 24%, rgba(34,211,238,${a * 0.6}) 52%, rgba(59,130,246,${a * 0.35}) 76%, transparent 100%)`,
                filter: "blur(6px)",
              }}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 rounded bg-background/70 px-2 py-1.5 backdrop-blur-sm">
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Low</span>
        <span
          className="h-1.5 flex-1 rounded-full"
          style={{ background: "linear-gradient(90deg, #3b82f6, #22d3ee, #f59e0b, #ef4444)" }}
        />
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">High</span>
      </div>
    </div>
  )
}
