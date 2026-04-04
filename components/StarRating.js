'use client'
import { useState } from 'react'

export default function StarRating({ input, analogy }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [thumbedDown, setThumbedDown] = useState(false)
  const [showThanks, setShowThanks] = useState(false)

  const submitted = rating > 0 || thumbedDown

  const submit = async (value) => {
    try {
      await fetch('/api/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, analogy, rating: value }),
      })
    } catch {
      // silent — feedback is optional, never block the user
    }
  }

  const handleRate = async (value) => {
    setRating(value)
    setShowThanks(true)
    setTimeout(() => setShowThanks(false), 1800)
    await submit(value)
  }

  const handleThumbDown = async () => {
    setThumbedDown(true)
    setShowThanks(true)
    setTimeout(() => setShowThanks(false), 1800)
    await submit(0)
  }

  const active = hover || rating

  return (
    <div className="star-rating">
      <button
        className={`thumb-down-btn${thumbedDown ? ' active' : ''}`}
        onClick={handleThumbDown}
        disabled={submitted}
        aria-label="Not a good analogy"
      >
        <span className="material-symbols-outlined">thumb_down</span>
      </button>
      <span className="star-rating-divider" />
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`star-btn${active >= star ? ' filled' : ''}`}
          onMouseEnter={() => !submitted && setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => handleRate(star)}
          disabled={submitted}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <span className="material-symbols-outlined">star</span>
        </button>
      ))}
      <span className={`thanks-text${showThanks ? ' visible' : ''}`}>
        {thumbedDown ? 'Noted!' : 'Thanks!'}
      </span>
    </div>
  )
}
