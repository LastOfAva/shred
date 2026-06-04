# SHRED

PWA di allenamento 30 giorni (4 giu – 3 lug 2026). Metrica: costanza.

Nessun tracciamento di cibo, calorie, peso, misure o aspetto.

## Avvio locale

```bash
npm install
npm run dev
```

Apri `http://localhost:5173/shred/`.

## Build

```bash
npm run build
npm run preview   # preview della build produzione
```

## Deploy — GitHub Pages

1. Crea repo GitHub `shred` (o il nome che preferisci).
2. Aggiorna `base` in `vite.config.ts` se il nome repo è diverso da `shred`.
3. Abilita **GitHub Pages** → Source: **GitHub Actions** (Settings → Pages).
4. Push su `main` → il workflow `.github/workflows/deploy.yml` builda e pubblica.

URL finale: `https://<username>.github.io/shred/`

## Installazione su iPhone

1. Apri l'URL in **Safari**.
2. Tap **Condividi** (rettangolo con freccia su) → **"Aggiungi a schermata Home"**.
3. L'app si apre in modalità standalone, funziona offline.

> Nota: le notifiche push non sono disponibili su iOS PWA. La spinta è nell'interfaccia.

## Dati

- Persistenza locale (`localStorage`). Nessun account, nessun backend, nessun cloud.
- **Esporta/Importa JSON** in Configurazione per backup manuale o trasferimento tra dispositivi.
- I dati restano sul dispositivo: cancellare il sito o disinstallare l'app cancella tutto.

## Stack

Vite · React · TypeScript · Tailwind CSS · vite-plugin-pwa
