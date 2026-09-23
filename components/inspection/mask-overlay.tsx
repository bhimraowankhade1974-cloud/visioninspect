"use client"

import type { InspectionResult } from "@/lib/inspection"

interface MaskOverlayProps {
  result: InspectionResult
}

/** Simplified binary-style anomaly mask: dark surface, bright anomaly region. */
export function MaskOverlay({ result }: MaskOverlayProps) {
  const { region, heatBlobs } = result
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg bg-[#05070c]/92">
      <div className="vx-fade-scale absolute inset-0">
        {/* Core mask region */}
        <div
          className="absolute rounded-md"
          style={{
            left: `${region.x}%`,
            top: `${region.y}%`,
            width: `${region.w}%`,
            height: `${region.h}%`,
            background: "radial-gradient(circle, #22d3ee 0%, #22d3ee 55%, rgba(34,211,238,0.35) 100%)",
            filter: "blur(3px)",
            boxShadow: "0 0 24px rgba(34,211,238,0.6)",
          }}
        />
        {/* Satellite blobs (strongest activations only) */}
        {heatBlobs
          .filter((b) => b.intensity > 0.5)
          .map((b, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/80"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.r}%`,
                height: `${b.r}%`,
                filter: "blur(4px)",
              }}
            />
          ))}
      </div>
      <div className="absolute left-2 top-2 rounded bg-background/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-primary backdrop-blur-sm">
        Anomaly Mask
      </div>
    </div>
  )
}
