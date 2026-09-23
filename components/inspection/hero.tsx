import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 pb-2 sm:px-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1">
        <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
          AI-Powered Quality Inspection
        </span>
      </div>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Industrial Visual Inspection
      </h2>
      <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
        Detect, localize and analyze product anomalies using computer vision.
      </p>
    </section>
  )
}
