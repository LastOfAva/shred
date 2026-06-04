interface Props {
  value: number  // 0-100
  label?: string
}

export default function ProgressBar({ value, label }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        {label && <span className="text-xs text-[#555]">{label}</span>}
        <span className="mono text-xs text-accent ml-auto">{value}%</span>
      </div>
      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  )
}
