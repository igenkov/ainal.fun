'use client'
import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
      setDark(true)
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '')
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
      <span className="material-symbols-outlined">
        {dark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}
