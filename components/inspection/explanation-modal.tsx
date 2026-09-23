"use client"

import { useEffect } from "react"
import { X, BrainCircuit } from "lucide-react"
import type { InspectionResult } from "@/lib/inspection"
import { verdictColor } from "@/lib/inspection"

interface ExplanationModalProps {
  result: InspectionResult
  onClose: () => void
}

export function ExplanationModal({ result, onClose }: ExplanationModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const color = verdictColor(result.verdict)

  const rows: [string, string][] = [
    ["Anomaly Score", `${result.anomalyScore.toFixed(1)}%`],
    ["Affected Area", `${result.affectedArea.toFixed(1)}%`],
    ["Quality Score", `${result.qualityScore} / 100`],
    ["Severity", result.severity],
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explain-title"
    >
      <button
        type="button"
        aria-label="Close explanation"
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      <div className="vx-fade-scale relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
              <BrainCircuit className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <h2 id="explain-title" className="text-base font-semibold text-foreground">
                AI Detection Explanation
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color }}>
                {result.verdict}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          The system identified visual features in the highlighted region that differ from the expected normal
          appearance.
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-2.5">
          {rows.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border bg-panel p-3">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 rounded-lg border border-warning/25 bg-warning/5 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-warning">Note:</span> This visualization represents the model&apos;s
          visual anomaly assessment and does not establish the physical root cause of the defect.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)]"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
