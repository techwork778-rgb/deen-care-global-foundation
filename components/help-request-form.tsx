'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { programs } from '@/lib/site-data'

type Defaults = { fullName?: string; email?: string }

export function HelpRequestForm({ defaults }: { defaults?: Defaults }) {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/api/help-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.status === 401) {
        router.push('/login?callbackUrl=/get-help')
        return
      }
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Please check your details and try again.')
      router.push(`/get-help/success?reference=${json.referenceId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="fullName">Full name *</label>
          <input id="fullName" name="fullName" required defaultValue={defaults?.fullName} />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number *</label>
          <input id="phone" name="phone" type="tel" placeholder="+1 555 000 0000" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email address *</label>
          <input id="email" name="email" type="email" required defaultValue={defaults?.email} />
        </div>
        <div className="field">
          <label htmlFor="country">Country / location *</label>
          <input id="country" name="country" required />
        </div>
        <div className="field">
          <label htmlFor="city">City (optional)</label>
          <input id="city" name="city" />
        </div>
        <div className="field">
          <label htmlFor="assistanceType">Type of assistance *</label>
          <select id="assistanceType" name="assistanceType" required>
            <option value="">Select one</option>
            {programs.slice(0, 7).map((p) => <option key={p.slug}>{p.title}</option>)}
            <option>Other</option>
          </select>
        </div>
        <div className="field full">
          <label htmlFor="description">Tell us what is happening *</label>
          <textarea
            id="description"
            name="description"
            minLength={30}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please share the situation and the kind of help you are seeking."
          />
          <span className="char-count">{description.length} / 3000</span>
        </div>
        <div className="field full">
          <label htmlFor="additionalInfo">Additional information (optional)</label>
          <textarea id="additionalInfo" name="additionalInfo" placeholder="Anything else you would like us to know?" />
        </div>
        <div className="field full hidden-honeypot" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
       {/* Consent Checkbox */}
<div className="sm:col-span-2 pt-2">
  <label className="flex items-start gap-3 cursor-pointer">
    <input
      type="checkbox"
      name="consent"
      value="true"
      required
      className="mt-1 w-4 h-4 rounded border-black bg-black text-black focus:ring-black focus:ring-offset-0"
    />

    <span className="text-xs leading-relaxed text-black">
      I confirm the information provided is true and I agree to the{' '}
      <a
        href="/privacy"
        target="_blank"
        rel="noreferrer"
        className="text-black underline"
      >
        privacy policy
      </a>
      .
    </span>
  </label>
</div>
        {error && <div className="field full"><p className="form-error" role="alert">{error}</p></div>}
        <div className="field full">
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit request'}
          </button>
        </div>
      </div>
    </form>
  )
}
