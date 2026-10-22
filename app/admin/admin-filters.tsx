'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { programs } from '@/lib/site-data'
import { REQUEST_STATUSES, STATUS_LABELS } from '@/lib/status'

export function AdminFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const [q, setQ] = useState(params.get('q') ?? '')
  const [status, setStatus] = useState(params.get('status') ?? '')
  const [type, setType] = useState(params.get('type') ?? '')
  const [from, setFrom] = useState(params.get('from') ?? '')
  const [to, setTo] = useState(params.get('to') ?? '')

  const apply = useCallback(() => {
    const sp = new URLSearchParams()
    if (q) sp.set('q', q)
    if (status) sp.set('status', status)
    if (type) sp.set('type', type)
    if (from) sp.set('from', from)
    if (to) sp.set('to', to)
    router.push(`${pathname}${sp.toString() ? `?${sp.toString()}` : ''}`)
  }, [q, status, type, from, to, router, pathname])

  const reset = useCallback(() => {
    setQ(''); setStatus(''); setType(''); setFrom(''); setTo('')
    router.push(pathname)
  }, [router, pathname])

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
    background: '#fff',
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
      <div>
        <label style={labelStyle}>Search</label>
        <input style={inputStyle} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, ID, text…" />
      </div>
      <div>
        <label style={labelStyle}>Status</label>
        <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          {REQUEST_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Request type</label>
        <select style={inputStyle} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All</option>
          {programs.slice(0, 7).map((p) => <option key={p.slug} value={p.title}>{p.title}</option>)}
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>From date</label>
        <input type="date" style={inputStyle} value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>To date</label>
        <input type="date" style={inputStyle} value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <button onClick={apply} style={{ ...btnPrimary, flex: 1 }}>Apply</button>
        <button onClick={reset} style={btnSecondary}>Reset</button>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }
const btnPrimary: React.CSSProperties = { padding: '8px 16px', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' }
const btnSecondary: React.CSSProperties = { padding: '8px 16px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, cursor: 'pointer' }
