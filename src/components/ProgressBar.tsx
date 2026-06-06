interface Props {
  value: number  // 0-100
  label?: string
}

export default function ProgressBar({ value, label }: Props) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        {label && <span className="text-xs text-[#555]">{label}</span>}
        <span className="mono text-xs text-accent ml-auto font-semibold">{clamped}%</span>
      </div>
      <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#2a2a2a]">
        <div
          className="h-full bg-accent rounded-full bar-animated"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
