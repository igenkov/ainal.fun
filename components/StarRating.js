'use client'
import { useState } from 'react'

export default function StarRating({ input, analogy }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [showThanks, setShowThanks] = useState(false)

  const handleRate = async (value) => {
    setRating(value)
    setShowThanks(true)
    setTimeout(() => setShowThanks(false), 1800)

    try {
      await fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, analogy, rating: value }),
      })
    } catch {
      // silent — rating is optional, never block the user
    }
  }

  const active = hover || rating

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`star-btn${active >= star ? ' filled' : ''}`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => handleRate(star)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <span className="material-symbols-outlined">star</span>
        </button>
      ))}
      <span className={`thanks-text${showThanks ? ' visible' : ''}`}>Thanks!</span>
    </div>
  )
}
