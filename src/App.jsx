import { useState } from 'react'
import { STAGES } from './stages.js'
import './App.css'

export default function App() {
  const [selected, setSelected] = useState(STAGES[0].id)
  const active = STAGES.find((stage) => stage.id === selected)
  const buildId = import.meta.env.VITE_BUILD_ID || 'lokal'

  return (
    <main className="board">
      <header className="board__head">
        <div>
          <p className="kicker">Demo CI/CD · LKS Cloud Computing</p>
          <h1>Pipeline Board</h1>
          <p className="lede">
            Halaman ini dibangun dan diuji oleh GitHub Actions. Klik satu tahap untuk melihat apa
            yang terjadi di dalamnya.
          </p>
        </div>
        <div className="badge">
          <span className="badge__value">{STAGES.length}</span>
          <span className="badge__label">tahap</span>
        </div>
      </header>

      <ol className="stages">
        {STAGES.map((stage, index) => (
          <li key={stage.id}>
            <button
              type="button"
              className={stage.id === selected ? 'stage stage--active' : 'stage'}
              aria-pressed={stage.id === selected}
              onClick={() => setSelected(stage.id)}
            >
              <span className="stage__num">{String(index + 1).padStart(2, '0')}</span>
              <span className="stage__title">{stage.title}</span>
              <span className="stage__sub">{stage.subtitle}</span>
            </button>
          </li>
        ))}
      </ol>

      <section className="detail" aria-live="polite">
        <p className="detail__service">{active.service}</p>
        <h2>{active.title}</h2>
        <p className="detail__body">{active.detail}</p>
      </section>

      <footer className="board__foot">
        <span>Build VITE_BUILD_ID: {buildId}</span>
        <span>Artefak build diunggah sebagai artifact workflow</span>
      </footer>
    </main>
  )
}
