import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db, helpRequests, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { statusLabel, statusColor } from '@/lib/status'
import { AdminRequestActions } from './actions'
import { requireAdmin } from '@/lib/supabase/server'
import { Logo } from '@/components/logo'

export const metadata = {
  title: 'Admin · Request | DEEN Care',
}

export const dynamic = 'force-dynamic'

export default async function AdminRequestDetail({
  params,
}: {
  params: Promise<{ referenceId: string }>
}) {
  // Defense in depth: middleware already blocks non-admins,
  // but re-check here.
  const admin = await requireAdmin()

  if (!admin) notFound()

  const { referenceId } = await params

  const [row] = await db
    .select({
      request: helpRequests,
      user: users,
    })
    .from(helpRequests)
    .leftJoin(users, eq(users.id, helpRequests.userId))
    .where(eq(helpRequests.referenceId, referenceId))
    .limit(1)

  if (!row) notFound()

  const r = row.request

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F6F6F3] text-[#111111]">

      {/* =====================================================
          TOP ACCENT
      ====================================================== */}

      <div className="h-[3px] w-full bg-gradient-to-r from-[#A77B20] via-[#D0AC4F] to-[#A77B20]" />

      <div className="mx-auto w-full max-w-[1180px] min-w-0 px-4 py-7 sm:px-6 lg:px-8">

        {/* ===================================================
            BACK NAVIGATION
        ==================================================== */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <Link
            href="/admin"
            className="group inline-flex min-h-11 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#555555] transition-colors duration-150 hover:text-[#8C6723] md:min-h-0"
          >
            <span className="transition-transform duration-150 group-hover:-translate-x-0.5">
              <BackIcon />
            </span>

            Back to all requests
          </Link>

          <Link href="/" aria-label="DEEN Care Global Foundation" className="inline-flex shrink-0">
            <Logo className="h-12 w-auto sm:h-14" />
          </Link>

        </div>

        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <header className="mb-7 min-w-0 overflow-hidden rounded-[22px] border border-[#111111]/10 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.045)]">

          <div className="min-w-0 p-5 sm:p-6 lg:p-7">

            <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

              {/* Header information */}

              <div className="min-w-0 max-w-full">

                <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2">

                  <span className="inline-flex max-w-full shrink-0 items-center gap-2 rounded-full bg-[#F5F0E4] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8C6723]">

                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B88A2C]" />

                    Assistance Request

                  </span>

                  <span className="text-[#BBBBB5]">/</span>

                  <code className="max-w-full break-all text-[10px] font-bold tracking-[0.04em] text-[#555555]">
                    {r.referenceId}
                  </code>

                </div>

                <h1 className="max-w-full break-words text-2xl font-bold tracking-[-0.035em] text-[#111111] sm:text-3xl lg:text-[34px]">
                  {r.fullName}
                </h1>

                <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-[#555555]">

                  <span className="inline-flex max-w-full items-center gap-1.5">
                    <CalendarIcon />
                    <span className="break-words">
                      Submitted {r.createdAt.toLocaleString()}
                    </span>
                  </span>

                  <span className="hidden h-1 w-1 shrink-0 rounded-full bg-[#AAAAAA] sm:block" />

                  <span className="inline-flex max-w-full items-center gap-1.5">
                    <LocationIcon />
                    <span className="break-words">
                      {r.city
                        ? `${r.city}, ${r.country}`
                        : r.country}
                    </span>
                  </span>

                </div>

              </div>

              {/* Status */}

              <div className="shrink-0 lg:text-right">

                <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.13em] text-[#666666]">
                  Current Status
                </div>

                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-bold"
                  style={{
                    backgroundColor: `${statusColor(r.status)}0D`,
                    borderColor: `${statusColor(r.status)}35`,
                    color: statusColor(r.status),
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: statusColor(r.status),
                    }}
                  />

                  {statusLabel(r.status)}
                </span>

              </div>

            </div>

          </div>

          {/* Header bottom strip */}

          <div className="flex min-w-0 flex-col gap-3 border-t border-[#111111]/10 bg-[#FCFCFA] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#555555]">

              <ShieldIcon />

              Admin view

            </div>

            <div className="break-all text-[9px] font-medium text-[#666666]">
              Request ID: {r.referenceId}
            </div>

          </div>

        </header>

        {/* ===================================================
            USER + GOOGLE ACCOUNT
        ==================================================== */}

        <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">

          {/* =================================================
              USER CARD
          ================================================== */}

          <Card
            title="Applicant Information"
            description="Personal details provided with the request."
            icon={<UserIcon />}
          >

            <div className="grid min-w-0 grid-cols-1 gap-x-6 sm:grid-cols-2">

              <Field
                label="Full name"
                value={r.fullName}
              />

              <Field
                label="Email"
                value={r.email}
              />

              <Field
                label="Phone"
                value={r.phone}
              />

              <Field
                label="Country"
                value={r.country}
              />

              <Field
                label="City"
                value={r.city || '—'}
              />

            </div>

          </Card>

          {/* =================================================
              GOOGLE ACCOUNT
          ================================================== */}

          <Card
            title="Google Account"
            description="Account information linked to this request."
            icon={<GoogleIcon />}
          >

            <Field
              label="Signed-in name"
              value={row.user?.fullName || '—'}
            />

            <Field
              label="Signed-in email"
              value={row.user?.email || '—'}
            />

            <div className="mb-4">

              <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#666666]">
                Linked account
              </p>

              <div className="flex min-w-0 items-center gap-2">

                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    row.user
                      ? 'bg-[#DCFCE7] text-[#15803D]'
                      : 'bg-[#F3F4F6] text-[#555555]'
                  }`}
                >
                  {row.user ? <CheckIcon /> : <MinusIcon />}
                </span>

                <span className="break-words text-[11px] font-semibold text-[#333333]">
                  {row.user
                    ? 'Yes'
                    : 'No (submitted before accounts)'}
                </span>

              </div>

            </div>

            {row.user?.avatarUrl && (
              <div className="border-t border-[#111111]/10 pt-4">

                <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#666666]">
                  Profile
                </p>

                <img
                  src={row.user.avatarUrl}
                  alt="Profile"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full border border-[#111111]/10 object-cover"
                />

              </div>
            )}

          </Card>

        </div>

        {/* ===================================================
            REQUEST DETAILS
        ==================================================== */}

        <div className="mt-5 min-w-0 max-w-full">

          <Card
            title="Request Details"
            description="Information submitted by the applicant."
            icon={<DocumentIcon />}
          >

            {/* Request Type */}

            <div className="mb-6 min-w-0 max-w-full">

              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#666666]">
                Request Type
              </p>

              <div className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-xl border border-[#111111]/10 bg-[#F8F8F6] px-3 py-2">

                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8C6723]" />

                <span
                  className="max-w-full break-words text-[11px] font-bold text-[#333333]"
                  style={{
                    overflowWrap: 'anywhere',
                  }}
                >
                  {r.assistanceType}
                </span>

              </div>

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <div className="min-w-0 max-w-full">

              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#666666]">
                Description
              </p>

              <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-[#111111]/10 bg-[#FAFAF8]">

                <div className="w-full min-w-0 max-w-full px-4 py-4">

                  <p
                    className="m-0 w-full min-w-0 max-w-full whitespace-pre-wrap break-words text-[12px] font-medium leading-6 text-[#333333]"
                    style={{
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                    }}
                  >
                    {r.description}
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                ADDITIONAL INFORMATION
            ================================================== */}

            {r.additionalInfo && (
              <div className="mt-5 min-w-0 max-w-full">

                <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#666666]">
                  Additional Information
                </p>

                <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-[#111111]/10 bg-[#FAFAF8]">

                  <div className="w-full min-w-0 max-w-full px-4 py-4">

                    <p
                      className="m-0 w-full min-w-0 max-w-full whitespace-pre-wrap break-words text-[12px] font-medium leading-6 text-[#333333]"
                      style={{
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                      }}
                    >
                      {r.additionalInfo}
                    </p>

                  </div>

                </div>

              </div>
            )}

          </Card>

        </div>

        {/* ===================================================
            ADMIN ACTIONS
        ==================================================== */}

        <div className="mt-5 min-w-0 max-w-full">

          <AdminRequestActions
            referenceId={r.referenceId}
            currentStatus={r.status}
            currentNotes={r.adminNotes || ''}
          />

        </div>

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <footer className="flex min-w-0 flex-col gap-2 px-1 py-7 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#666666] sm:flex-row sm:items-center sm:justify-between">

          <Link href="/" aria-label="DEEN Care Global Foundation" className="inline-flex">
            <Logo className="h-14 w-auto" />
          </Link>

          <span>
            Request Management
          </span>

        </footer>

      </div>
    </main>
  )
}

/* ============================================================
   CARD
============================================================ */

function Card({
  title,
  description,
  icon,
  children,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-[20px] border border-[#111111]/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.035)]">

      {/* Card Header */}

      <div className="flex min-w-0 items-start gap-3 border-b border-[#111111]/10 bg-[#FCFCFA] px-5 py-4 sm:px-6">

        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E4] text-[#8C6723]">
            {icon}
          </div>
        )}

        <div className="min-w-0 max-w-full">

          <h2 className="break-words text-[13px] font-bold tracking-[-0.01em] text-[#111111]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 max-w-full break-words text-[10px] font-medium leading-4 text-[#555555]">
              {description}
            </p>
          )}

        </div>

      </div>

      {/* Card Content */}

      <div className="min-w-0 max-w-full p-5 sm:p-6">
        {children}
      </div>

    </section>
  )
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="mb-4 min-w-0 max-w-full last:mb-0">

      <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#666666]">
        {label}
      </p>

      <p
        className="m-0 max-w-full break-words text-[12px] font-semibold leading-5 text-[#222222]"
        style={{
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </p>

    </div>
  )
}

/* ============================================================
   ICONS
============================================================ */

function BackIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 20 6v5c0 5.2-3.4 8.8-8 10-4.6-1.2-8-4.8-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4.1 3.4-6 8-6s7.2 1.9 8 6" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M20.5 12h-8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 1 6.2 2.7" />
      <path d="M12 20.5a8.5 8.5 0 0 1-6.2-2.7" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 12h12" />
    </svg>
  )
}