import type { InspectionResult } from "./inspection"
import type { UploadedImage } from "@/components/inspection/image-uploader"

const COLORS = {
  bg: "#070b12",
  card: "#0d131d",
  border: "#1e293b",
  primary: "#22d3ee",
  white: "#f8fafc",
  muted: "#94a3b8",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
}

function verdictHex(v: InspectionResult["verdict"]) {
  if (v === "NORMAL") return COLORS.success
  if (v === "REVIEW REQUIRED") return COLORS.warning
  return COLORS.danger
}

/** Draws a clean inspection summary card to a canvas and downloads it as PNG. */
export function downloadReport(result: InspectionResult, image: UploadedImage) {
  const W = 900
  const H = 620
  const canvas = document.createElement("canvas")
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, W, H)

  // Header
  ctx.fillStyle = COLORS.primary
  ctx.font = "700 30px monospace"
  ctx.fillText("VISIONINSPECT-X", 48, 64)
  ctx.fillStyle = COLORS.muted
  ctx.font = "14px sans-serif"
  ctx.fillText("Industrial AI Visual Inspection · Demo Report", 48, 88)

  ctx.strokeStyle = COLORS.border
  ctx.beginPath()
  ctx.moveTo(48, 110)
  ctx.lineTo(W - 48, 110)
  ctx.stroke()

  // Verdict banner
  const vColor = verdictHex(result.verdict)
  ctx.fillStyle = COLORS.card
  roundRect(ctx, 48, 134, W - 96, 76, 12)
  ctx.fill()
  ctx.fillStyle = vColor
  ctx.font = "700 26px sans-serif"
  ctx.fillText(result.verdict, 72, 182)
  ctx.fillStyle = COLORS.muted
  ctx.font = "14px sans-serif"
  ctx.fillText(`Severity: ${result.severity}`, W - 220, 182)

  // Metrics grid
  const metrics: [string, string, string][] = [
    ["ANOMALY LEVEL", `${result.anomalyScore.toFixed(1)}%`, vColor],
    ["CONFIDENCE", `${result.confidence.toFixed(1)}%`, COLORS.white],
    ["AFFECTED AREA", `${result.affectedArea.toFixed(1)}%`, COLORS.white],
    ["QUALITY SCORE", `${result.qualityScore} / 100`, COLORS.white],
    ["PROCESSING TIME", `${result.processingTime.toFixed(1)} sec`, COLORS.white],
    ["TARGET MODEL", "PatchCore", COLORS.primary],
  ]

  const cols = 3
  const cardW = (W - 96 - 24 * (cols - 1)) / cols
  const cardH = 92
  metrics.forEach((m, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = 48 + col * (cardW + 24)
    const y = 242 + row * (cardH + 20)
    ctx.fillStyle = COLORS.card
    roundRect(ctx, x, y, cardW, cardH, 10)
    ctx.fill()
    ctx.fillStyle = COLORS.muted
    ctx.font = "11px monospace"
    ctx.fillText(m[0], x + 18, y + 30)
    ctx.fillStyle = m[2]
    ctx.font = "700 26px monospace"
    ctx.fillText(m[1], x + 18, y + 66)
  })

  // Image meta
  ctx.fillStyle = COLORS.muted
  ctx.font = "13px monospace"
  const meta = image.width > 0 ? `${image.name}  ·  ${image.width} × ${image.height} px` : image.name
  ctx.fillText(meta, 48, 500)

  // Note
  ctx.fillStyle = COLORS.warning
  ctx.font = "12px sans-serif"
  ctx.fillText("Note: Demo inspection.", 48, 534)
  ctx.fillStyle = COLORS.muted
  wrapText(
    ctx,
    "This visualization represents the model's visual anomaly assessment and does not establish the physical root cause of the defect.",
    48,
    556,
    W - 96,
    18,
  )

  const link = document.createElement("a")
  link.download = `visioninspect-report-${Date.now()}.png`
  link.href = canvas.toDataURL("image/png")
  link.click()
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ")
  let line = ""
  let yy = y
  for (const word of words) {
    const test = line + word + " "
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line, x, yy)
      line = word + " "
      yy += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line, x, yy)
}
