"use client"

import { useCountUp } from "@/hooks/use-count-up"

interface CircularGaugeProps {
  /** 0-100 fill percentage of the ring */
  percent: number
  /** Displayed value (defaults to percent) */
  value?: number
  suffix?: string
  decimals?: number
  color: string
  label: string
  size?: number
  stroke?: number
}

export function CircularGauge({
  percent,
  value,
  suffix = "%",
  decimals = 1,
  color,
  label,
  size = 168,
  stroke = 12,
}: CircularGaugeProps) {
  const display = value ?? percent
  const animated = useCountUp(display, 1100, decimals)
  const animatedPercent = useCountUp(percent, 1100, 1)

  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(animatedPercent, 100) / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke 0.4s ease", filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-semibold tabular-nums" style={{ color }}>
          {animated.toFixed(decimals)}
          <span className="text-xl">{suffix}</span>
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  )
}
