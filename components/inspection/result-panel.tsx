"use client"

import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  RotateCcw,
  Info,
  Download,
  ScanEye,
  Gauge,
  Crosshair,
  Percent,
  Clock,
  Layers,
} from "lucide-react"
import type { InspectionResult } from "@/lib/inspection"
import { verdictColor, qualityColor } from "@/lib/inspection"
import { CircularGauge } from "./circular-gauge"
import type { ViewTab } from "./image-viewer"

interface ResultPanelProps {
  result: InspectionResult
  onNewInspection: () => void
  onExplain: () => void
  onDownload: () => void
  onTab: (tab: ViewTab) => void
  activeTab: ViewTab
}

const VERDICT_ICON = {
  NORMAL: CheckCircle2,
  "REVIEW REQUIRED": AlertTriangle,
  "ANOMALY DETECTED": AlertOctagon,
} as const

const VERDICT_PREFIX = {
  NORMAL: "✓",
  "REVIEW REQUIRED": "⚠",
  "ANOMALY DETECTED": "!",
} as const

export function ResultPanel({ result, onNewInspection, onExplain, onDownload, onTab, activeTab }: ResultPanelProps) {
  const color = verdictColor(result.verdict)
  const Icon = VERDICT_ICON[result.verdict]
  const qColor = qualityColor(result.qualityScore)

  return (
    <div className="vx-fade-up flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Inspection Result</h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Demo Inspection
          </span>
        </div>
      </div>

      {/* Verdict */}
      <div
        className="flex items-center gap-3 rounded-xl border px-4 py-3"
        style={{ borderColor: `${color}55`, backgroundColor: `${color}12` }}
      >
        <Icon className="h-6 w-6 shrink-0" style={{ color }} strokeWidth={2} />
        <div className="leading-tight">
          <p className="font-mono text-base font-bold tracking-wide" style={{ color }}>
            <span aria-hidden className="mr-1">
              {VERDICT_PREFIX[result.verdict]}
            </span>
            {result.verdict}
          </p>
          <p className="text-[11px] text-muted-foreground">Severity: {result.severity}</p>
        </div>
      </div>

      {/* Anomaly gauge (headline metric) */}
      <div className="flex flex-col items-center rounded-xl border border-border bg-panel py-6">
        <CircularGauge
          percent={result.anomalyScore}
          value={result.anomalyScore}
          decimals={1}
          color={color}
          label="Anomaly Level"
          size={184}
        />
        <p className="mt-3 px-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          Demo anomaly score / proportion defined by this frontend demonstration.
        </p>
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <Metric icon={ScanEye} label="Confidence" value={`${result.confidence.toFixed(1)}%`} />
        <Metric icon={Percent} label="Affected Area" value={`${result.affectedArea.toFixed(1)}%`} />
        <Metric icon={Gauge} label="Quality Score" value={`${result.qualityScore} / 100`} valueColor={qColor} />
        <Metric icon={AlertTriangle} label="Severity" value={result.severity} />
        <Metric icon={Clock} label="Processing Time" value={`${result.processingTime.toFixed(1)} sec`} />
        <Metric icon={Layers} label="Model" value="PatchCore" mono />
      </div>

      {/* Quality gauge */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-panel p-4">
        <CircularGauge
          percent={result.qualityScore}
          value={result.qualityScore}
          decimals={0}
          suffix=""
          color={qColor}
          label="Quality"
          size={116}
          stroke={9}
        />
        <div className="flex-1">
          <p className="font-mono text-sm font-semibold" style={{ color: qColor }}>
            {result.qualityScore} / 100
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {result.qualityScore >= 90
              ? "Product meets expected visual quality."
              : result.qualityScore >= 70
                ? "Minor deviations found — review recommended."
                : "Significant deviation — review recommended."}
          </p>
        </div>
      </div>

      {/* Detected region */}
      <div className="rounded-xl border border-border bg-panel p-4">
        <div className="flex items-center gap-2">
          <Crosshair className="h-4 w-4 text-primary" strokeWidth={2} />
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground">
            Detected Region
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Visual irregularity detected in the highlighted region. The system analyzes visual information only and does
          not determine a physical root cause.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onExplain}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
          >
            <Info className="h-4 w-4" strokeWidth={2} />
            Explain Detection
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Download Result
          </button>
        </div>

        {/* Quick view switch */}
        <div className="flex gap-1.5">
          {(["ORIGINAL", "DETECTION", "HEATMAP", "MASK"] as ViewTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTab(t)}
              className={`flex-1 rounded-md border px-1 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider transition-colors ${
                activeTab === t
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onNewInspection}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(34,211,238,0.4)]"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2.25} />
          New Inspection
        </button>
      </div>

      {/* Technical footer */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border border-border bg-panel/60 p-4 font-mono text-[10px]">
        <TechRow label="Inspection Mode" value="Demo" />
        <TechRow label="Computer Vision" value="Anomaly Detection" />
        <TechRow label="Dataset Concept" value="MVTec AD" />
        <TechRow label="Target Model" value="PatchCore" />
      </dl>
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  valueColor,
  mono,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: string
  valueColor?: string
  mono?: boolean
}) {
  return (
    <div className="rounded-lg border border-border bg-panel p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p
        className={`mt-1.5 text-base font-semibold tabular-nums ${mono ? "font-mono text-sm" : ""}`}
        style={{ color: valueColor ?? "var(--foreground)" }}
      >
        {value}
      </p>
    </div>
  )
}

function TechRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="uppercase tracking-wider text-muted-foreground/70">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  )
}
