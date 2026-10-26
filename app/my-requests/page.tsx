import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { PageFrame } from '@/components/site-shell'
import { db, helpRequests } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'
import { statusLabel, statusColor } from '@/lib/status'
import { getSession } from '@/lib/supabase/server'

export const metadata = {
  title: 'My requests | DEEN Care Global Foundation',
  description: 'View the status of your submitted requests.',
}

export default async function MyRequests() {
  const user = await getSession()
  if (!user) notFound()

  const rows = await db
    .select()
    .from(helpRequests)
    .where(eq(helpRequests.userId, user.id))
    .orderBy(desc(helpRequests.createdAt))

  return (
    <PageFrame crumbs={[{ label: 'My requests' }]}>
      <main>
        <section className="page-hero">
          <div className="shell">
            <p className="eyebrow">My requests</p>
            <h1>Your submitted requests</h1>
            <p>Track the status of any request you have submitted. We aim to respond within 5 working days.</p>
          </div>
        </section>
        <section className="section">
          <div className="shell content-copy">
            {rows.length === 0 ? (
              <div className="form-card" style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: 24 }}>You have not submitted any requests yet.</p>
                <Link href="/get-help" className="button">Request assistance <ArrowRight size={16} /></Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {rows.map((r) => (
                  <div key={r.id} className="form-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ minWidth: 0, maxWidth: '100%' }}>
                        <div style={{ fontFamily: 'monospace', color: '#6b7280', fontSize: 13, overflowWrap: 'anywhere' }}>{r.referenceId}</div>
                        <h3 style={{ margin: '6px 0 4px' }}>{r.assistanceType}</h3>
                        <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
                          Submitted {r.createdAt.toLocaleString()}
                        </p>
                      </div>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#fff',
                        background: statusColor(r.status),
                      }}>
                        {statusLabel(r.status)}
                      </span>
                    </div>
                    <p style={{ marginTop: 14, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{r.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </PageFrame>
  )
}
