// Frontend-only inspection simulation.
//
// This module intentionally contains NO real ML model. It produces a
// self-consistent, demo-labelled inspection result so the computer-vision
// workflow can be demonstrated in the browser. The shape of `InspectionResult`
// is designed so a real model output (e.g. PatchCore) can be dropped in later
// without changing the UI.

export type Verdict = "NORMAL" | "REVIEW REQUIRED" | "ANOMALY DETECTED"
export type Severity = "Low" | "Medium" | "High"

export interface Region {
  /** All values are percentages (0-100) relative to the image box. */
  x: number
  y: number
  w: number
  h: number
}

export interface HeatBlob {
  x: number // %
  y: number // %
  r: number // % radius
  intensity: number // 0-1
}

export interface FeaturePoint {
  x: number // %
  y: number // %
  delay: number // ms
}

export interface InspectionResult {
  verdict: Verdict
  anomalyScore: number // 0-100
  confidence: number // 0-100
  affectedArea: number // 0-100 (% of surface)
  qualityScore: number // 0-100
  severity: Severity
  processingTime: number // seconds
  region: Region
  heatBlobs: HeatBlob[]
  featurePoints: FeaturePoint[]
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function round(n: number, digits = 1) {
  const f = 10 ** digits
  return Math.round(n * f) / f
}

function verdictFromScore(score: number): Verdict {
  if (score < 30) return "NORMAL"
  if (score < 65) return "REVIEW REQUIRED"
  return "ANOMALY DETECTED"
}

function severityFromScore(score: number): Severity {
  if (score < 30) return "Low"
  if (score < 65) return "Medium"
  return "High"
}

export const PROCESSING_STAGES = [
  "Loading image",
  "Preprocessing image",
  "Extracting visual features",
  "Analyzing image",
  "Detecting anomalies",
  "Generating heatmap",
  "Calculating quality score",
  "Inspection complete",
] as const

/**
 * Generate a demo inspection result. Values are randomized per run but kept
 * internally consistent (verdict, severity and quality all follow the score).
 */
export function generateInspection(): InspectionResult {
  // Bias toward showing an interesting anomaly for demonstrations, while still
  // occasionally returning clean / review outcomes.
  const roll = Math.random()
  let anomalyScore: number
  if (roll < 0.2) anomalyScore = rand(6, 26) // normal
  else if (roll < 0.45) anomalyScore = rand(34, 62) // review
  else anomalyScore = rand(68, 93) // anomaly

  anomalyScore = round(anomalyScore, 1)

  const verdict = verdictFromScore(anomalyScore)
  const severity = severityFromScore(anomalyScore)

  // Quality inversely tracks anomaly score, with a little noise.
  const qualityScore = Math.max(
    12,
    Math.min(99, Math.round(100 - anomalyScore * 0.9 + rand(-6, 6))),
  )

  const confidence = round(rand(88, 98.5), 1)
  const affectedArea = round((anomalyScore / 100) * rand(3, 8), 1)
  const processingTime = round(rand(0.6, 1.4), 1)

  // Anomaly region — kept away from the edges so overlays read cleanly.
  const w = rand(16, 30)
  const h = rand(16, 30)
  const x = rand(12, 88 - w)
  const y = rand(12, 88 - h)
  const region: Region = {
    x: round(x, 1),
    y: round(y, 1),
    w: round(w, 1),
    h: round(h, 1),
  }

  // Heatmap blobs cluster around the anomaly region, with a few faint outliers.
  const cx = region.x + region.w / 2
  const cy = region.y + region.h / 2
  const blobCount = 3 + Math.floor(rand(0, 3))
  const heatBlobs: HeatBlob[] = [
    { x: cx, y: cy, r: Math.max(region.w, region.h) * 0.7, intensity: 1 },
  ]
  for (let i = 0; i < blobCount; i++) {
    heatBlobs.push({
      x: round(cx + rand(-18, 18), 1),
      y: round(cy + rand(-18, 18), 1),
      r: round(rand(8, 18), 1),
      intensity: round(rand(0.35, 0.85), 2),
    })
  }
  // Faint background activation
  for (let i = 0; i < 4; i++) {
    heatBlobs.push({
      x: round(rand(10, 90), 1),
      y: round(rand(10, 90), 1),
      r: round(rand(6, 12), 1),
      intensity: round(rand(0.12, 0.28), 2),
    })
  }

  // Feature points scattered across the image (machine-vision look).
  const featurePoints: FeaturePoint[] = Array.from({ length: 26 }, () => ({
    x: round(rand(6, 94), 1),
    y: round(rand(6, 94), 1),
    delay: Math.round(rand(0, 900)),
  }))

  return {
    verdict,
    anomalyScore,
    confidence,
    affectedArea,
    qualityScore,
    severity,
    processingTime,
    region,
    heatBlobs,
    featurePoints,
  }
}

export function verdictColor(verdict: Verdict) {
  switch (verdict) {
    case "NORMAL":
      return "var(--success)"
    case "REVIEW REQUIRED":
      return "var(--warning)"
    case "ANOMALY DETECTED":
      return "var(--danger)"
  }
}

export function qualityColor(score: number) {
  if (score >= 90) return "var(--success)"
  if (score >= 70) return "var(--warning)"
  return "var(--danger)"
}
