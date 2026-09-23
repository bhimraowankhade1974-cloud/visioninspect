"use client"

import { useEffect, useRef, useState } from "react"
import { Cpu, Check } from "lucide-react"
import { PROCESSING_STAGES } from "@/lib/inspection"

interface ProcessingAnimationProps {
  onComplete: () => void
}

const STAGE_MESSAGES = [
  "Loading image...",
  "Preprocessing image...",
  "Extracting visual features...",
  "Analyzing visual features...",
  "Detecting anomalies...",
  "Generating anomaly map...",
  "Calculating quality score...",
  "Inspection complete",
]

const TOTAL_MS = 3200

export function ProcessingAnimation({ onComplete }: ProcessingAnimationProps) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const start = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(elapsed / TOTAL_MS, 1)
      setProgress(p * 100)
      setStage(Math.min(Math.floor(p * PROCESSING_STAGES.length), PROCESSING_STAGES.length - 1))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!done.current) {
        done.current = true
        setTimeout(onComplete, 450)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  const blocks = 22
  const filled = Math.round((progress / 100) * blocks)

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
          <Cpu className="h-5 w-5 animate-pulse" strokeWidth={1.75} />
        </span>
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          AI Vision Engine
        </span>
      </div>

      <p className="mt-6 min-h-6 font-mono text-sm text-foreground" aria-live="polite">
        {STAGE_MESSAGES[stage]}
      </p>

      {/* Block progress bar */}
      <div className="mt-5 flex w-full max-w-sm items-center gap-3">
        <div className="flex flex-1 gap-[3px]" aria-hidden>
          {Array.from({ length: blocks }).map((_, i) => (
            <span
              key={i}
              className="h-4 flex-1 rounded-[2px] transition-colors duration-150"
              style={{
                backgroundColor: i < filled ? "var(--primary)" : "var(--muted)",
                boxShadow: i < filled ? "0 0 8px rgba(34,211,238,0.5)" : "none",
              }}
            />
          ))}
        </div>
        <span className="w-12 shrink-0 text-right font-mono text-sm font-semibold tabular-nums text-primary">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Stage checklist */}
      <ul className="mt-7 grid w-full max-w-sm grid-cols-1 gap-1.5 text-left sm:grid-cols-2">
        {PROCESSING_STAGES.map((s, i) => {
          const complete = i < stage
          const active = i === stage
          return (
            <li
              key={s}
              className="flex items-center gap-2 font-mono text-[11px]"
              style={{
                color: complete
                  ? "var(--success)"
                  : active
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
              }}
            >
              <span className="flex h-3.5 w-3.5 items-center justify-center">
                {complete ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : active ? (
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-primary" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                )}
              </span>
              {s}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
