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

  return (
    <div className="admin-actions">
      <div>
        <label className="admin-label">Status</label>
        <select className="admin-control" value={status} onChange={(e) => setStatus(e.target.value)}>
          {REQUEST_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>
      <div>
        <label className="admin-label">Admin notes</label>
        <textarea className="admin-control admin-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes — not visible to the user." />
      </div>
      <div className="admin-filter-actions">
        <button type="button" onClick={save} disabled={saving} className="admin-btn admin-btn-primary">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {message && <span className={message.ok ? 'admin-message is-ok' : 'admin-message'}>{message.text}</span>}
      </div>
    </div>
  )
}
