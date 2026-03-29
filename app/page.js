'use client'
import { useState, useRef, useEffect } from 'react'
import AnalogyCard from '../components/AnalogyCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ThemeToggle from '../components/ThemeToggle'

export default function Home() {
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('idle') // idle | loading | results
  const [analogies, setAnalogies] = useState([])
  const [error, setError] = useState('')
  const textareaRef = useRef(null)

  // Auto-grow textarea as user types
  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  // Allow body to scroll when results are shown
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
      {/* Nav */}
      <nav>
        <a href="#">
          <img src="/logo_transp2.png" alt="Ainal.fun" style={{ height: '48px', display: 'block' }} />
        </a>
        <div className="nav-links">
          <ThemeToggle />
          <a href="#">How it works</a>
        </div>
      </nav>

      {/* Floating background dots */}
      <div className="bg-dots">
        <div className="dot" style={{ top: '22%', left: '8%', width: 8, height: 8, background: 'var(--secondary-fixed-dim)', opacity: 0.3 }} />
        <div className="dot" style={{ top: '70%', left: '15%', width: 10, height: 10, background: 'var(--tertiary-fixed)', opacity: 0.45, animationDelay: '-6s' }} />
        <div className="dot" style={{ top: '30%', right: '18%', width: 6, height: 6, background: 'var(--secondary-fixed)', opacity: 0.2, animationDelay: '-9s' }} />
        <div className="dot" style={{ bottom: '15%', right: '8%', width: 14, height: 14, background: 'var(--surface-high)', opacity: 0.5, animationDelay: '-13s' }} />
        <div className="dot" style={{ top: '55%', right: '12%', width: 7, height: 7, background: 'var(--outline-variant)', opacity: 0.15, animationDelay: '-4s' }} />
        <div className="dot" style={{ bottom: '30%', left: '30%', width: 5, height: 5, background: 'var(--secondary-fixed-dim)', opacity: 0.2, animationDelay: '-7s' }} />
      </div>

      {/* Main */}
      <main className={phase === 'results' ? 'results-mode' : ''}>

        {/* Hero — always visible */}
        <section className="hero">
          <h1 className="hero-main">Just an <span style={{ color: '#2bbfb0', fontWeight: 600 }}>analogy generator</span></h1>
          <p className="hero-sub">(...yeah, not what you expected.)</p>

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
                  style={{ fontSize: '1.1rem' }}
                >
                  {phase === 'loading' ? 'autorenew' : 'trending_flat'}
                </span>
              </button>
            </div>
            <p className="input-hint">
              {phase === 'results'
                ? 'Change concept and think again to regenerate'
                : 'Enter a concept to bridge the void'}
            </p>
            {error && <p className="error-message">{error}</p>}
          </div>
        </section>

        {/* Bottom section — switches by phase */}
        {phase === 'idle' && <BentoSection />}

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
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>refresh</span>
                Regenerate
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer>
        <span>© 2025 Ainal</span>
      </footer>
    </>
  )
}

function BentoSection() {
  return (
    <section className="bento">
      <div className="bento-image">
        <img
          src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80"
          alt="Minimalist white architecture"
        />
        <div className="overlay">
          <span className="overlay-tag">The Concept</span>
          <p>Opening a site, called ainal.fun and landing in an analogy generator is like opening a door, that says &ldquo;girls&rdquo; and there is just a toilet inside.</p>
        </div>
      </div>
      <div className="bento-right">
        <div className="bento-card">
          <span className="material-symbols-outlined icon">auto_awesome</span>
          <h3>Three ways to say it better</h3>
          <p>Type any concept above. Get three brilliant analogies — everyday, intellectual, and surprising.</p>
        </div>
        <a className="browse-link" href="#">
          <span className="text">Browse The Pool</span>
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </a>
      </div>
    </section>
  )
}
