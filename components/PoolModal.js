'use client'
import { useEffect, useState } from 'react'

export default function PoolModal({ onClose }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    fetch('/api/pool')
      .then(r => r.json())
      .then(data => { setItems(data.pool || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box pool-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="pool-title">The Pool</h2>
        <p className="pool-subtitle">Recent top-rated analogies</p>

        {loading && <p className="pool-empty">Loading...</p>}

        {!loading && items.length === 0 && (
          <p className="pool-empty">No rated analogies yet. Be the first to rate one!</p>
        )}

        {!loading && items.length > 0 && (
          <div className="pool-list">
            {items.map((item, i) => (
              <div key={i} className="pool-item">
                <div className="pool-input">{item.input}</div>
                <div className="pool-analogy">{item.analogy}</div>
                <div className="pool-stars">
                  {Array.from({ length: item.rating }, (_, j) => (
                    <span key={j} className="material-symbols-outlined pool-star">star</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
