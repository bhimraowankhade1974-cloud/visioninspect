"use client"

import { useCallback, useState } from "react"
import { Play } from "lucide-react"
import { NavBar } from "@/components/inspection/nav-bar"
import { Hero } from "@/components/inspection/hero"
import { ImageUploader, type UploadedImage } from "@/components/inspection/image-uploader"
import { ImageViewer, type ViewTab, type Phase } from "@/components/inspection/image-viewer"
import { ProcessingAnimation } from "@/components/inspection/processing-animation"
import { ResultPanel } from "@/components/inspection/result-panel"
import { ExplanationModal } from "@/components/inspection/explanation-modal"
import { generateInspection, type InspectionResult } from "@/lib/inspection"
import { downloadReport } from "@/lib/report"

export default function Page() {
  const [image, setImage] = useState<UploadedImage | null>(null)
  const [phase, setPhase] = useState<Phase>("idle")
  const [result, setResult] = useState<InspectionResult | null>(null)
  const [activeTab, setActiveTab] = useState<ViewTab>("DETECTION")
  const [showExplain, setShowExplain] = useState(false)

  const handleImage = useCallback((img: UploadedImage) => {
    setImage(img)
    setPhase("idle")
    setResult(null)
    setActiveTab("DETECTION")
  }, [])

  const startInspection = useCallback(() => {
    setResult(generateInspection())
    setPhase("processing")
  }, [])

  const onProcessingComplete = useCallback(() => {
    setPhase("done")
    setActiveTab("DETECTION")
  }, [])

  const newInspection = useCallback(() => {
    setImage(null)
    setPhase("idle")
    setResult(null)
    setShowExplain(false)
    setActiveTab("DETECTION")
  }, [])

  const handleDownload = useCallback(() => {
    if (result && image) downloadReport(result, image)
  }, [result, image])

  return (
    <div className="min-h-dvh bg-background">
      <NavBar />
      <Hero />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* LEFT — image workspace */}
          <section
            aria-label="Image workspace"
            className="vx-scrollbar rounded-2xl border border-border bg-card p-4 sm:p-5"
          >
            {!image ? (
              <ImageUploader onImage={handleImage} />
            ) : (
              <div className="flex flex-col gap-4">
                <ImageViewer
                  image={image}
                  phase={phase}
                  result={result}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />

                {phase === "idle" && (
                  <button
                    type="button"
                    onClick={startInspection}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[0_0_24px_rgba(34,211,238,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(34,211,238,0.5)]"
                  >
                    <Play className="h-4 w-4 transition-transform group-hover:scale-110" strokeWidth={2.5} />
                    Start AI Inspection
                  </button>
                )}
              </div>
            )}
          </section>

          {/* RIGHT — result panel */}
          <section
            aria-label="Inspection results"
            className="vx-scrollbar rounded-2xl border border-border bg-card p-4 sm:p-5"
          >
            {phase === "idle" && <IdlePanel hasImage={!!image} />}
            {phase === "processing" && <ProcessingAnimation onComplete={onProcessingComplete} />}
            {phase === "done" && result && (
              <ResultPanel
                result={result}
                onNewInspection={newInspection}
                onExplain={() => setShowExplain(true)}
                onDownload={handleDownload}
                onTab={setActiveTab}
                activeTab={activeTab}
              />
            )}
          </section>
        </div>
      </main>

      {showExplain && result && <ExplanationModal result={result} onClose={() => setShowExplain(false)} />}
    </div>
  )
}

function IdlePanel({ hasImage }: { hasImage: boolean }) {
  return (
    <div className="flex h-full min-h-[340px] flex-col items-center justify-center px-6 text-center">
      <div className="vx-grid-overlay flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-panel opacity-90">
        <span className="h-3 w-3 rounded-full bg-primary/60" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground">
        {hasImage ? "Ready to Inspect" : "Awaiting Image"}
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {hasImage
          ? 'Press "Start AI Inspection" to run the computer-vision workflow and generate anomaly results.'
          : "Upload or select an industrial image to begin the visual inspection workflow."}
      </p>

      <ol className="mt-6 flex flex-col gap-2 text-left">
        {["Upload image", "Run AI inspection", "Review anomaly & quality"].map((step, i) => (
          <li key={step} className="flex items-center gap-2.5 font-mono text-[11px] text-muted-foreground">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[10px] font-semibold text-primary">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}
