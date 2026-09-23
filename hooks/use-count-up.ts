"use client"

import { useEffect, useRef, useState } from "react"

/** Animates a number from 0 up to `target` over `duration` ms (ease-out). */
export function useCountUp(target: number, duration = 900, decimals = 0) {
  const [value, setValue] = useState(0)
  const frame = useRef<number | null>(null)
  const start = useRef<number | null>(null)

  useEffect(() => {
    start.current = null
    const f = 10 ** decimals

    const step = (ts: number) => {
      if (start.current === null) start.current = ts
      const progress = Math.min((ts - start.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased * f) / f)
      if (progress < 1) {
        frame.current = requestAnimationFrame(step)
      }
    }

    frame.current = requestAnimationFrame(step)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [target, duration, decimals])

  return value
}
