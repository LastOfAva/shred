/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: '#e8ff3c',
        surface: '#111111',
        card: '#1a1a1a',
        border: '#2a2a2a',
        muted: '#555555',
        dim: '#888888',
        blockA: '#d946ef',
        blockB: '#0ea5e9',
        blockC: '#22c55e',
        blockD: '#f97316',
        blockE: '#ef4444',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pop': 'pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'cell-light': 'cellLight 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'streak-glow': 'streakGlow 0.9s ease-in-out 2',
        'bar-fill': 'barFill 0.7s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'blob-a': 'blobA 22s ease-in-out infinite',
        'blob-b': 'blobB 28s ease-in-out infinite',
        'blob-c': 'blobC 18s ease-in-out infinite',
      },
      keyframes: {
        pop: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.45)' },
          '100%': { transform: 'scale(1)' },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'translateY(-14px) scale(0.9)' },
          '65%':  { opacity: '1', transform: 'translateY(4px) scale(1.02)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        cellLight: {
          '0%':   { opacity: '0.5', transform: 'scale(0.82)' },
          '65%':  { opacity: '1',   transform: 'scale(1.1)' },
          '100%': { opacity: '1',   transform: 'scale(1)' },
        },
        streakGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 0px rgba(232,255,60,0))' },
          '50%':      { filter: 'drop-shadow(0 0 10px rgba(232,255,60,0.9))' },
        },
        barFill: {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blobA: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%':      { transform: 'translate(40px, -40px) scale(1.15)' },
          '66%':      { transform: 'translate(-30px, 20px) scale(0.9)' },
        },
        blobB: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%':      { transform: 'translate(-50px, 30px) scale(0.85)' },
          '66%':      { transform: 'translate(20px, -40px) scale(1.1)' },
        },
        blobC: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%':      { transform: 'translate(20px, 30px) scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
