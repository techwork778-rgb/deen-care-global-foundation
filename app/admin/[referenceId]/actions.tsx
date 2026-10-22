'use client'

import { useState } from 'react'
import { REQUEST_STATUSES, STATUS_LABELS } from '@/lib/status'

export function AdminRequestActions({
  referenceId,
  currentStatus,
  currentNotes,
}: {
  referenceId: string
  currentStatus: string
  currentNotes: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(currentNotes)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/requests/${referenceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Update failed.')
      setMessage({ ok: true, text: 'Saved.' })
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : 'Update failed.' })
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
    background: '#fff',
    width: '100%',
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Status</label>
        <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
          {REQUEST_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Admin notes</label>
        <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes — not visible to the user." />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={save} disabled={saving} style={{ padding: '8px 18px', background: '#111827', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {message && <span style={{ fontSize: 13, color: message.ok ? '#16a34a' : '#dc2626' }}>{message.text}</span>}
      </div>
    </div>
  )
}
