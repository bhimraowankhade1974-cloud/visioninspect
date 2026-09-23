"use client"

import type { InspectionResult } from "@/lib/inspection"
import { verdictColor } from "@/lib/inspection"

interface DetectionOverlayProps {
  result: InspectionResult
}

export function DetectionOverlay({ result }: DetectionOverlayProps) {
  const { region, anomalyScore, verdict } = result
  const isAnomaly = verdict === "ANOMALY DETECTED"
  const color = verdictColor(verdict)

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Dim everything except the region using an outward box-shadow */}
      <div
        className="vx-draw-box absolute rounded-md"
        style={{
          left: `${region.x}%`,
          top: `${region.y}%`,
          width: `${region.w}%`,
          height: `${region.h}%`,
          border: `2px solid ${color}`,
          boxShadow: `0 0 0 100vmax rgba(7,11,18,0.55), 0 0 18px ${color}80`,
        }}
      >
        {/* Corner ticks */}
        {(["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-left-[3px] -bottom-[3px]", "-right-[3px] -bottom-[3px]"] as const).map(
          (cls) => (
            <span
              key={cls}
              className={`absolute h-2.5 w-2.5 rounded-full ${cls} ${isAnomaly ? "vx-pulse-danger" : ""}`}
              style={{ backgroundColor: color }}
            />
          ),
        )}

        {/* Label */}
        <div
          className="absolute -top-7 left-0 flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-0.5 font-mono text-[11px] font-semibold"
          style={{ backgroundColor: color, color: "#06121a" }}
        >
          {isAnomaly ? "ANOMALY" : verdict === "REVIEW REQUIRED" ? "REVIEW" : "REGION"}
          <span className="tabular-nums">{anomalyScore.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  )
}
