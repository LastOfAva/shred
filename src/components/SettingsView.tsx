import { useState, useRef } from 'react'
import { useStore } from '../hooks/useStore'

interface Props {
  store: ReturnType<typeof useStore>
}

export default function SettingsView({ store }: Props) {
  const [exportMsg, setExportMsg] = useState('')
  const [importMsg, setImportMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    const data = store.exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shred-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportMsg('File scaricato.')
    setTimeout(() => setExportMsg(''), 3000)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const json = ev.target?.result as string
      const ok = store.importData(json)
      setImportMsg(ok ? 'Dati importati con successo.' : 'Errore: file non valido.')
      setTimeout(() => setImportMsg(''), 4000)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="p-4 flex flex-col gap-5">
      <h2 className="mono font-bold text-xl text-accent pt-2">Configurazione</h2>

      {/* Backup */}
      <div className="card p-4 flex flex-col gap-4">
        <div>
          <p className="font-semibold text-sm">Backup dati</p>
          <p className="text-xs text-[#555] mt-1">
            I dati sono salvati solo su questo dispositivo. Esporta/importa JSON per trasferirli.
            Nessuna sincronizzazione automatica.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={handleExport} className="btn-primary">
            Esporta JSON
          </button>
          {exportMsg && <p className="text-xs text-green-400">{exportMsg}</p>}

          <button onClick={() => fileRef.current?.click()} className="btn-ghost">
            Importa JSON
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          {importMsg && (
            <p className={`text-xs ${importMsg.startsWith('Errore') ? 'text-red-400' : 'text-green-400'}`}>
              {importMsg}
            </p>
          )}
        </div>
      </div>

      {/* About */}
      <div className="card p-4 flex flex-col gap-2">
        <p className="font-semibold text-sm">SHRED</p>
        <p className="text-xs text-[#555]">
          Programma 30 giorni · 4 giu – 3 lug 2026<br />
          Metrica: costanza. Nessun tracciamento di cibo, peso, misure o calorie.<br />
          PWA offline · dati locali · nessun account
        </p>
      </div>

      {/* Install PWA hint */}
      <div className="card p-4 flex flex-col gap-2 border-[#2a2a2a]">
        <p className="font-semibold text-sm">Installazione</p>
        <p className="text-xs text-[#555]">
          <strong className="text-[#888]">iPhone:</strong> Safari → condividi → "Aggiungi a Home".<br />
          <strong className="text-[#888]">Chrome/Edge:</strong> icona installa nella barra URL.<br />
          Una volta installata, funziona offline.
        </p>
      </div>

      {/* Scope note */}
      <div className="card p-4 border-red-950">
        <p className="text-xs text-[#555]">
          <strong className="text-red-500">Scope dell'app:</strong> SOLO movimento e costanza.<br />
          Cibo, peso, calorie, misure, foto: fuori scope — gestiti dal nutrizionista e specialista BIA.
        </p>
      </div>
    </div>
  )
}
