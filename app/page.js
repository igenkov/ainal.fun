'use client'
import { useState, useRef, useEffect } from 'react'
import AnalogyCard from '../components/AnalogyCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import HowItWorksModal from '../components/HowItWorksModal'
import PoolModal from '../components/PoolModal'

export default function Home() {
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('idle') // idle | loading | results
  const [analogies, setAnalogies] = useState([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showPool, setShowPool] = useState(false)
  const textareaRef = useRef(null)

  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  useEffect(() => {
    if (phase === 'results') {
      document.body.classList.add('scrollable')
    } else {
      document.body.classList.remove('scrollable')
    }
    return () => document.body.classList.remove('scrollable')
  }, [phase])

  const generate = async () => {
    if (!input.trim() || phase === 'loading') return
    setPhase('loading')
    setError('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnalogies(data.analogies)
      setPhase('results')
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
      setPhase('idle')
    }
  }

  return (
    <>
      {/* Background layers */}
      <div className="bg-cityscape" />
      <div className="bg-neon-grid" />
      <div className="bg-character">
        <div className="bg-character-inner">
          <div className="bg-character-img-wrap">
            <img src="/character.png" alt="" />
            <div className="bg-character-overlay-side" />
            <div className="bg-character-overlay-bottom" />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav>
        <a href="#" onClick={(e) => { e.preventDefault(); setPhase('idle'); setInput(''); setAnalogies([]); setError('') }}>
          <img src="/logo_neon.png" alt="Ainal.fun" style={{ height: 'clamp(40px, 8vw, 56px)', display: 'block' }} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button className="nav-link-desktop" onClick={() => setShowPool(true)}>The Pool</button>
          <button className="nav-link-desktop" onClick={() => setShowModal(true)}>How it works</button>
          <button className="mobile-info nav-link-desktop" onClick={() => setShowModal(true)} aria-label="How it works">
            <span className="material-symbols-outlined" style={{ fontSize: '1.3rem' }}>info</span>
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className={phase === 'results' ? 'results-mode' : ''}>
        <section className="hero">
          {/* Slogan Cluster */}
          <div className="hero-header-cluster">
            <h1 className="hero-main">
              <span style={{ color: '#00ffff', textShadow: '0 0 10px rgba(0,255,255,0.8), 0 0 20px rgba(0,255,255,0.4)' }}>Just an </span>
              <span style={{ color: '#ff00ff', textShadow: '0 0 10px rgba(255,0,255,0.8), 0 0 20px rgba(255,0,255,0.4)' }}>analogy game</span>
            </h1>
            {phase === 'idle' && (
              <p className="hero-sub">(...yeah, not what you expected.)</p>
            )}
          </div>

          {/* Action Cluster (Input) */}
          <div className="input-section">
            <div className="input-row">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                placeholder="Type a concept..."
                rows={1}
                disabled={phase === 'loading'}
              />
              <button
                className="think-btn"
                onClick={generate}
                disabled={!input.trim() || phase === 'loading'}
              >
                <span className="label">
                  {phase === 'loading' ? 'Thinking' : 'Think'}
                </span>
                <span
                  className={`material-symbols-outlined${phase === 'loading' ? ' spin' : ''}`}
                  style={{ fontSize: '1rem' }}
                >
                  {phase === 'loading' ? 'autorenew' : 'trending_flat'}
                </span>
              </button>
            </div>
            <p className="input-hint">
                {phase === 'results' ? 'Change concept and think again to regenerate' : 'Enter a concept - get the idea'}
            </p>
            {error && <p className="error-message">{error}</p>}
          </div>

          {phase === 'idle' && (
            <>
              <div className="example-analogy">
                <div className="example-analogy-bar" />
                <p className="example-analogy-text">
                  Opening a site, called <span style={{ color: '#ff00ff' }}>ainal.fun</span> and landing in an analogy game is like opening a door, that says <span style={{ color: '#ff00ff' }}>&apos;GIRLS&apos;</span> and there is just a toilet inside.
                </p>
              </div>
            </>
          )}
        </section>

        {phase === 'loading' && <LoadingSkeleton />}

        {phase === 'results' && (
          <section className="results">
            <div className="results-grid">
              {analogies.map((text, i) => (
                <AnalogyCard key={i} index={i} text={text} input={input} />
              ))}
            </div>
            <div className="regenerate-row">
              <button className="regenerate-btn" onClick={generate}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>refresh</span>
                Regenerate
              </button>
            </div>
          </section>
        )}
      </main>

      {showModal && <HowItWorksModal onClose={() => setShowModal(false)} />}
      {showPool && <PoolModal onClose={() => setShowPool(false)} />}

      {/* Footer */}
      <footer>
        <span>© 2026 AINAL</span>
        <a href="/privacy" className="footer-link">Privacy</a>
      </footer>
    </>
  )
}
