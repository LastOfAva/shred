import { useState } from 'react'

interface Props {
  onActivate: () => void
}

export default function EscapeHatch({ onActivate }: Props) {
  const [confirm, setConfirm] = useState(false)

  if (confirm) {
    return (
      <div className="card border-[#3a3a3a] p-4 flex flex-col gap-3">
        <p className="text-sm text-[#ccc]">Registra riposo attivo (20-25 min e-bike facile / camminata).<br />Lo streak resta vivo.</p>
        <div className="flex gap-2">
          <button onClick={onActivate} className="btn-primary flex-1">
            Confermo — registro riposo attivo
          </button>
          <button onClick={() => setConfirm(false)} className="btn-ghost px-3">
            Annulla
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="w-full card border-[#333] p-3.5 text-left flex items-center gap-3 hover:border-[#555] transition-colors"
    >
      <span className="text-[#555] text-lg">🃏</span>
      <div>
        <p className="text-sm text-[#888]">Oggi non ce la faccio</p>
        <p className="text-xs text-[#555]">Registra riposo attivo → streak vivo</p>
      </div>
    </button>
  )
}
