"use client"

import { useCallback, useRef, useState } from "react"
import { ImageUp, Images, FolderOpen } from "lucide-react"
import { SAMPLE_IMAGES } from "@/lib/samples"

export interface UploadedImage {
  src: string
  name: string
  width: number
  height: number
  isSample?: boolean
}

interface ImageUploaderProps {
  onImage: (image: UploadedImage) => void
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"]

function loadDimensions(src: string, name: string, isSample = false): Promise<UploadedImage> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve({ src, name, width: img.naturalWidth, height: img.naturalHeight, isSample })
    img.onerror = () => resolve({ src, name, width: 0, height: 0, isSample })
    img.src = src
  })
}

export function ImageUploader({ onImage }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sampleIndex = useRef(0)

  const handleFile = useCallback(
    async (file: File) => {
      if (!ACCEPTED.includes(file.type)) {
        setError("Unsupported file. Please use JPG, PNG or WEBP.")
        return
      }
      setError(null)
      const src = URL.createObjectURL(file)
      const image = await loadDimensions(src, file.name)
      onImage(image)
    },
    [onImage],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const useSample = useCallback(async () => {
    const sample = SAMPLE_IMAGES[sampleIndex.current % SAMPLE_IMAGES.length]
    sampleIndex.current += 1
    const image = await loadDimensions(sample.src, sample.label, true)
    onImage(image)
  }, [onImage])

  return (
    <div className="flex flex-col gap-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload industrial image. Drag and drop or press Enter to browse."
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`group relative flex min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
          dragging
            ? "border-primary bg-primary/10 shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
            : "border-border bg-panel hover:border-primary/50 hover:bg-primary/[0.04]"
        }`}
      >
        <div className="vx-grid-overlay pointer-events-none absolute inset-0 rounded-xl opacity-40" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
          <ImageUp className="h-7 w-7" strokeWidth={1.6} />
        </div>
        <h3 className="relative mt-5 text-lg font-semibold text-foreground">Upload Industrial Image</h3>
        <p className="relative mt-1.5 max-w-xs text-sm text-muted-foreground">
          Drag &amp; drop an image here or browse from your device
        </p>
        <p className="relative mt-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70">
          JPG · PNG · WEBP
        </p>

        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              inputRef.current?.click()
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(34,211,238,0.4)]"
          >
            <FolderOpen className="h-4 w-4" strokeWidth={2} />
            Browse Image
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              useSample()
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
          >
            <Images className="h-4 w-4" strokeWidth={2} />
            Use Sample Image
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ""
          }}
        />
      </div>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
