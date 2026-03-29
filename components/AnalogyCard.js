'use client'
import { useState, useEffect } from 'react'
import StarRating from './StarRating'

const LABELS = ['A', 'B', 'C']

export default function AnalogyCard({ index, text, input }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)

    let i = 0
    // Stagger card start by index so they type in sequence
    const startDelay = index * 180

    const starter = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, 14)
      return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(starter)
  }, [text, index])

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="analogy-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="card-header">
        <span className="card-label">{LABELS[index]}</span>
        <button
          className={`copy-btn${copied ? ' copied' : ''}`}
          onClick={handleCopy}
        >
          <span className="material-symbols-outlined">
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <p className="card-text">
        {displayed}
        {!done && <span className="cursor">|</span>}
      </p>

      {done && <StarRating input={input} analogy={text} />}
    </div>
  )
}
