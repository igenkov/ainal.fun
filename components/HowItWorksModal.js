'use client'
import { useEffect } from 'react'

export default function HowItWorksModal({ onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <span className="material-symbols-outlined">close</span>
        </button>
        <p className="modal-body">
          Think of it as a translator — not between languages, but between what you mean and what people actually get.
        </p>
        <p className="modal-body">
          Type anything. Get three analogies back.
        </p>
        <p className="modal-body">
          For copywriting, for trying to explain or understand something yourself, to sound smarter in an argument, or for the sake of <em>"there must be a better way to say this."</em> Generally — just for fun.
        </p>
      </div>
    </div>
  )
}
