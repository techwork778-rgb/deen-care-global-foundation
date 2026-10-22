'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { socialLinks } from '@/lib/site-data'

function SocialIcon({ id }: { id: (typeof socialLinks)[number]['id'] }) {
  const common = { viewBox: '0 0 24 24', width: 16, height: 16, 'aria-hidden': true as const, fill: 'currentColor' }
  switch (id) {
    case 'facebook':
      return <svg {...common}><path d="M14.5 8.5V6.8c0-.7.5-1 1.1-1H17V3h-2.2C12.2 3 11 4.4 11 6.6v1.9H9v2.7h2V21h3.1v-8.8h2.2l.4-2.7h-2.6z" /></svg>
    case 'instagram':
      return <svg {...common}><path d="M12 7.4A4.6 4.6 0 1 0 16.6 12 4.6 4.6 0 0 0 12 7.4zm0 7.6A3 3 0 1 1 15 12a3 3 0 0 1-3 3zm5.8-8.9a1.08 1.08 0 1 1-1.08-1.07 1.08 1.08 0 0 1 1.08 1.07zM12 4.6c1.5 0 1.7 0 2.3.1a3.7 3.7 0 0 1 2.4 1 3.7 3.7 0 0 1 1 2.4c.1.6.1.8.1 2.3s0 1.7-.1 2.3a3.7 3.7 0 0 1-1 2.4 3.7 3.7 0 0 1-2.4 1c-.6.1-.8.1-2.3.1s-1.7 0-2.3-.1a3.7 3.7 0 0 1-2.4-1 3.7 3.7 0 0 1-1-2.4c-.1-.6-.1-.8-.1-2.3s0-1.7.1-2.3a3.7 3.7 0 0 1 1-2.4 3.7 3.7 0 0 1 2.4-1c.6-.1.8-.1 2.3-.1M12 3c-1.5 0-1.7 0-2.4.1a5.2 5.2 0 0 0-3.4 1.4A5.2 5.2 0 0 0 4.8 8c-.1.7-.1.9-.1 2.4s0 1.7.1 2.4a5.2 5.2 0 0 0 1.4 3.4 5.2 5.2 0 0 0 3.4 1.4c.7.1.9.1 2.4.1s1.7 0 2.4-.1a5.2 5.2 0 0 0 3.4-1.4 5.2 5.2 0 0 0 1.4-3.4c.1-.7.1-.9.1-2.4s0-1.7-.1-2.4a5.2 5.2 0 0 0-1.4-3.4A5.2 5.2 0 0 0 14.4 3.1C13.7 3 13.5 3 12 3z" /></svg>
    case 'x':
      return <svg {...common}><path d="M17.6 3h2.8l-6.1 7 7.2 9.5h-5.6l-4.4-5.7L6.4 19.5H3.6l6.5-7.5L3.2 3h5.8l4 5.2L17.6 3zm-1 14.8h1.6L7.5 4.1H5.8l10.8 13.7z" /></svg>
    case 'linkedin':
      return <svg {...common}><path d="M6.5 9.5H3.7V20h2.8V9.5zM5.1 4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM20.3 20h-2.8v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20H11V9.5h2.7v1.4h.1c.4-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.4V20z" /></svg>
    case 'youtube':
      return <svg {...common}><path d="M23 12.2s0-3.2-.4-4.6a3 3 0 0 0-2.1-2.1C18.9 5 12 5 12 5s-6.9 0-8.5.5a3 3 0 0 0-2.1 2.1C1 9 1 12.2 1 12.2s0 3.2.4 4.6a3 3 0 0 0 2.1 2.1C5.1 19.4 12 19.4 12 19.4s6.9 0 8.5-.5a3 3 0 0 0 2.1-2.1c.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.2 3.3-6.2 3.3z" /></svg>
    case 'whatsapp':
      return <svg {...common}><path d="M12 3.2A8.7 8.7 0 0 0 4.6 16.3L3.4 20.6l4.4-1.1A8.7 8.7 0 1 0 12 3.2zm5 12.3c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.8-.3-1.4-.5-2.5-1.1-4.1-3.6-4.2-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .5.4.2.6.7 1.9.7 2 0 .2.1.3 0 .5-.1.2-.2.3-.3.5l-.2.3c-.1.1-.2.3-.1.5.2.3.7 1.2 1.6 1.9 1.1.9 2 1.1 2.3 1.3.2.1.4.1.5 0 .2-.1.7-.8.9-1.1.2-.3.4-.2.6-.1.3.1 1.6.8 1.9.9.3.2.4.2.5.3.1.3.1.8-.1 1.4z" /></svg>
    case 'tiktok':
      return <svg {...common}><path d="M14.8 3c.4 2.4 1.7 4 4 4.4v2.5a6.7 6.7 0 0 1-4-1.3v6.6a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.7a3 3 0 1 0 2.1 2.9V3h2.7z" /></svg>
  }
}

export function SocialLinkList({ className }: { className: string }) {
  return (
    <div className={className}>
      {socialLinks.map((item) => (
        <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.name}>
          <SocialIcon id={item.id} />
        </a>
      ))}
    </div>
  )
}

export function SocialDock() {
  const [open, setOpen] = useState(false)
  const [canHover, setCanHover] = useState(false)
  const closeTimer = useRef<number | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setCanHover(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const show = () => {
    if (!canHover) return
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpen(true)
  }

  const hide = () => {
    if (!canHover) return
    closeTimer.current = window.setTimeout(() => setOpen(false), 160)
  }

  return (
    <div className={`social-dock${open ? ' is-open' : ''}`} onMouseEnter={show} onMouseLeave={hide}>
      <ul className="social-dock-panel">
        {socialLinks.map((item) => (
          <li key={item.id}>
            <a className="social-dock-link" href={item.href} target="_blank" rel="noopener noreferrer">
              <span>{item.name}</span>
              <i><SocialIcon id={item.id} /></i>
            </a>
          </li>
        ))}
      </ul>
      <button type="button" className="social-dock-toggle" aria-expanded={open} aria-label={open ? 'Close social links' : 'Open social links'} onClick={() => { if (!canHover) setOpen((value) => !value) }}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
