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

  return (
    <div className="admin-filters">
      <div>
        <label className="admin-label">Search</label>
        <input className="admin-control" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, ID, text…" />
      </div>
      <div>
        <label className="admin-label">Status</label>
        <select className="admin-control" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          {REQUEST_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>
      <div>
        <label className="admin-label">Request type</label>
        <select className="admin-control" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All</option>
          {programs.slice(0, 7).map((p) => <option key={p.slug} value={p.title}>{p.title}</option>)}
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="admin-label">From date</label>
        <input className="admin-control" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div>
        <label className="admin-label">To date</label>
        <input className="admin-control" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="admin-filter-actions">
        <button type="button" onClick={apply} className="admin-btn admin-btn-primary">Apply</button>
        <button type="button" onClick={reset} className="admin-btn admin-btn-secondary">Reset</button>
      </div>
    </div>
  )
}
