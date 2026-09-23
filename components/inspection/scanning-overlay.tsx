"use client"

import type { FeaturePoint } from "@/lib/inspection"

interface ScanningOverlayProps {
  featurePoints: FeaturePoint[]
}

export function ScanningOverlay({ featurePoints }: ScanningOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
      {/* Cyan analysis border */}
      <div className="absolute inset-0 rounded-lg border border-primary/70 shadow-[inset_0_0_20px_rgba(34,211,238,0.25)]" />

      {/* Subtle grid */}
      <div className="vx-grid-overlay absolute inset-0 opacity-60" />

      {/* Scanning line */}
      <div className="vx-scanline absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-primary/25 to-transparent">
        <div className="absolute bottom-0 h-px w-full bg-primary shadow-[0_0_12px_2px_rgba(34,211,238,0.8)]" />
      </div>

      {/* Feature points */}
      {featurePoints.map((p, i) => (
        <span
          key={i}
          className="vx-feature absolute h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(34,211,238,0.9)]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.delay}ms` }}
        />
      ))}

      {/* Corner brackets */}
      {(
        [
          "left-2 top-2 border-l-2 border-t-2",
          "right-2 top-2 border-r-2 border-t-2",
          "left-2 bottom-2 border-b-2 border-l-2",
          "right-2 bottom-2 border-b-2 border-r-2",
        ] as const
      ).map((cls) => (
        <span key={cls} className={`absolute h-5 w-5 border-primary/80 ${cls}`} />
      ))}

      {/* Scanning label */}
      <div className="absolute right-2 top-2 flex items-center gap-1.5 rounded bg-background/70 px-2 py-1 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-primary">Scanning</span>
      </div>
    </div>
  )
}
