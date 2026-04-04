'use client'
import { useEffect } from 'react'

export default function HowItWorksModal({ onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="hiw-fullscreen" onClick={onClose}>
      <div className="hiw-overlay" />
      <div className="hiw-content" onClick={(e) => e.stopPropagation()}>
        <button className="hiw-close" onClick={onClose} aria-label="Close">
          <span className="material-symbols-outlined">close</span>
        </button>
        <p className="hiw-title">How it works</p>
        <p className="hiw-body">
          Think of it as a translator — not between languages, but between what you mean and what people actually get.
        </p>
        <p className="hiw-body">
          Type anything. Get three analogies back.
        </p>
        <p className="hiw-body">
          For copywriting, for trying to explain or understand something yourself, to sound smarter in an argument, or for the sake of <em>&ldquo;there must be a better way to say this.&rdquo;</em> Generally — just for fun.
        </p>
      </div>
    </div>
  )
}
