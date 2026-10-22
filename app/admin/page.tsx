import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db, helpRequests } from '@/lib/db'
import { desc } from 'drizzle-orm'
import { statusLabel, statusColor } from '@/lib/status'
import { AdminFilters } from './admin-filters'
import { requireAdmin } from '@/lib/supabase/server'
import { Logo } from '@/components/logo'

export const metadata = {
  title: 'Admin · Requests | DEEN Care Global',
}

export const dynamic = 'force-dynamic'

type SearchParams = {
  q?: string
  status?: string
  type?: string
  from?: string
  to?: string
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const admin = await requireAdmin()

  if (!admin) notFound()

  const params = await searchParams

  const q = params.q?.trim().toLowerCase()
  const status = params.status?.trim()
  const type = params.type?.trim()
  const from = params.from ? new Date(params.from) : null
  const to = params.to ? new Date(params.to) : null

  /*
   * =========================================================
   * EXISTING DATABASE QUERY — UNCHANGED
   * =========================================================
   */

  let rows = await db
    .select({
      id: helpRequests.id,
      referenceId: helpRequests.referenceId,
      fullName: helpRequests.fullName,
      email: helpRequests.email,
      country: helpRequests.country,
      city: helpRequests.city,
      assistanceType: helpRequests.assistanceType,
      description: helpRequests.description,
      status: helpRequests.status,
      createdAt: helpRequests.createdAt,
    })
    .from(helpRequests)
    .orderBy(desc(helpRequests.createdAt))

  /*
   * =========================================================
   * EXISTING FILTER LOGIC — UNCHANGED
   * =========================================================
   */

  rows = rows.filter((r) => {
    if (status && r.status !== status) return false

    if (type && r.assistanceType !== type) return false

    if (from && r.createdAt < from) return false

    if (to && r.createdAt > new Date(to.getTime() + 86_400_000)) {
      return false
    }

    if (q) {
      const hay =
        `${r.referenceId} ${r.fullName} ${r.email} ${r.country} ${
          r.city ?? ''
        } ${r.assistanceType} ${r.description}`.toLowerCase()

      if (!hay.includes(q)) return false
    }

    return true
  })

  /*
   * =========================================================
   * DASHBOARD STATS
   * =========================================================
   */

  const uniqueCategories = new Set(
    rows.map((r) => r.assistanceType)
  ).size

  const uniqueCountries = new Set(
    rows.map((r) => r.country)
  ).size

  const today = new Date()

  const todayCount = rows.filter((r) => {
    const date = new Date(r.createdAt)

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }).length

  return (
    <main className="min-h-screen bg-[#F6F6F3] text-[#111111]">
      {/* =====================================================
          TOP GOLD ACCENT
      ====================================================== */}

      <div className="h-[3px] w-full bg-gradient-to-r from-[#A77B20] via-[#D0AC4F] to-[#A77B20]" />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="mx-auto w-full max-w-[1480px] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            {/* Header Content */}

            <div>
              <div className="mb-4 flex items-center gap-4">
                <Link href="/" aria-label="DEEN Care Global Foundation" className="inline-flex">
                  <Logo className="h-16 w-auto" />
                </Link>

                <span className="h-px w-8 bg-[#111111]/15" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#555555]">
                  Administration
                </span>
              </div>

              <h1 className="font-serif text-3xl font-normal tracking-[-0.035em] text-[#111111] sm:text-4xl lg:text-[44px]">
                Assistance Requests
              </h1>

              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#444444]">
                Review and manage assistance requests submitted through
                DEEN Care Global Foundation.
              </p>
            </div>

            {/* Request Counter */}

            <div className="flex items-center">
              <div className="flex items-center gap-4 rounded-2xl border border-[#111111]/10 bg-white px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F0E4] text-[#8C6723]">
                  <RequestIcon />
                </div>

                <div>
                  <div className="text-xl font-bold tracking-[-0.03em] text-[#111111]">
                    {rows.length}
                  </div>

                  <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#555555]">
                    {rows.length === 1
                      ? 'Request found'
                      : 'Requests found'}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="mt-7 h-px bg-gradient-to-r from-[#111111]/15 via-[#111111]/5 to-transparent" />
        </header>

        {/* ===================================================
            STAT CARDS
        ==================================================== */}

        <section className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <StatCard
            label="Total Requests"
            value={rows.length}
            description="Current result set"
            icon={<RequestIcon />}
            accent
          />

          <StatCard
            label="Submitted Today"
            value={todayCount}
            description="New requests today"
            icon={<ClockIcon />}
          />

          <StatCard
            label="Categories"
            value={uniqueCategories}
            description="Assistance types"
            icon={<GridIcon />}
          />

          <StatCard
            label="Countries"
            value={uniqueCountries}
            description="Applicant locations"
            icon={<GlobeIcon />}
          />

        </section>

        {/* ===================================================
            FILTER SECTION
        ==================================================== */}

        <section className="mb-7 overflow-hidden rounded-[20px] border border-[#111111]/10 bg-white shadow-[0_8px_35px_rgba(0,0,0,0.04)]">

          {/* Filter Header */}

          <div className="flex items-center justify-between border-b border-[#111111]/10 px-5 py-4 sm:px-6">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F5F2] text-[#333333]">
                <FilterIcon />
              </div>

              <div>
                <h2 className="text-[12px] font-bold text-[#111111]">
                  Filter Requests
                </h2>

                <p className="mt-0.5 text-[10px] font-medium text-[#555555]">
                  Search and refine submitted requests
                </p>
              </div>

            </div>

            <span className="hidden rounded-full bg-[#F5F5F2] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-[#555555] sm:inline-flex">
              Request Management
            </span>

          </div>

          {/* Existing Filters */}

          <div className="p-4 sm:p-5">
            <AdminFilters />
          </div>

        </section>

        {/* ===================================================
            REQUEST DIRECTORY
        ==================================================== */}

        <section className="overflow-hidden rounded-[20px] border border-[#111111]/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.045)]">

          {/* Directory Header */}

          <div className="flex flex-col gap-3 border-b border-[#111111]/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-[14px] font-bold tracking-[-0.01em] text-[#111111]">
                  Request Directory
                </h2>

                <span className="rounded-full bg-[#F4EFE2] px-2 py-0.5 text-[9px] font-bold text-[#8C6723]">
                  {rows.length}
                </span>

              </div>

              <p className="mt-1 text-[10px] font-medium text-[#555555]">
                All matching assistance requests
              </p>

            </div>

            <div className="flex items-center gap-2 text-[10px] font-medium text-[#555555]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B88A2C]" />
              Sorted by latest submission
            </div>

          </div>

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {rows.length === 0 ? (

            <div className="flex min-h-[390px] flex-col items-center justify-center px-6 text-center">

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#111111]/10 bg-[#F8F8F6] text-[#555555]">
                <SearchIcon />
              </div>

              <h3 className="text-[15px] font-bold text-[#111111]">
                No requests found
              </h3>

              <p className="mt-2 max-w-sm text-[12px] font-medium leading-5 text-[#555555]">
                No assistance requests match your current filters.
                Try changing your search criteria or date range.
              </p>

            </div>

          ) : (

            /* =================================================
               DATA TABLE
            ================================================== */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1080px] border-collapse text-left">

                <thead>
                  <tr className="border-b border-[#111111]/10 bg-[#FAFAF8]">

                    <Th>
                      Request ID
                    </Th>

                    <Th>
                      Applicant
                    </Th>

                    <Th>
                      Contact
                    </Th>

                    <Th>
                      Category
                    </Th>

                    <Th>
                      Submitted
                    </Th>

                    <Th>
                      Status
                    </Th>

                    <Th className="text-right">
                      Action
                    </Th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-[#111111]/[0.07]">

                  {rows.map((r) => (

                    <tr
                      key={r.id}
                      className="group transition-colors duration-150 hover:bg-[#FCFBF7]"
                    >

                      {/* ===================================
                          REQUEST ID
                      ==================================== */}

                      <Td>

                        <div className="flex items-center gap-3">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#111111]/10 bg-[#F8F8F6] text-[10px] font-bold text-[#444444]">
                            #
                          </div>

                          <div>

                            <code className="text-[11px] font-bold tracking-[0.02em] text-[#8C6723]">
                              {r.referenceId}
                            </code>

                            <div className="mt-0.5 text-[9px] font-medium text-[#666666]">
                              Assistance request
                            </div>

                          </div>

                        </div>

                      </Td>

                      {/* ===================================
                          APPLICANT
                      ==================================== */}

                      <Td>

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#111111]/10 bg-[#F2F2EF] text-[10px] font-bold text-[#333333]">
                            {getInitials(r.fullName)}
                          </div>

                          <div className="min-w-0">

                            <div className="max-w-[180px] truncate text-[12px] font-bold text-[#111111]">
                              {r.fullName}
                            </div>

                            <div className="mt-0.5 max-w-[180px] truncate text-[10px] font-medium text-[#555555]">
                              {r.city
                                ? `${r.city}, ${r.country}`
                                : r.country}
                            </div>

                          </div>

                        </div>

                      </Td>

                      {/* ===================================
                          EMAIL
                      ==================================== */}

                      <Td>

                        <div className="max-w-[210px] truncate font-mono text-[10px] font-medium text-[#444444]">
                          {r.email}
                        </div>

                      </Td>

                      {/* ===================================
                          CATEGORY
                      ==================================== */}

                      <Td>

                        <span className="inline-flex max-w-[190px] items-center gap-2 rounded-lg border border-[#111111]/10 bg-[#F8F8F6] px-2.5 py-1.5">

                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#555555]" />

                          <span className="truncate text-[10px] font-semibold text-[#333333]">
                            {r.assistanceType}
                          </span>

                        </span>

                      </Td>

                      {/* ===================================
                          DATE
                      ==================================== */}

                      <Td>

                        <div className="text-[11px] font-semibold text-[#444444]">

                          {r.createdAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}

                        </div>

                        <div className="mt-0.5 text-[9px] font-medium text-[#666666]">

                          {r.createdAt.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}

                        </div>

                      </Td>

                      {/* ===================================
                          STATUS
                      ==================================== */}

                      <Td>
                        <StatusBadge status={r.status} />
                      </Td>

                      {/* ===================================
                          ACTION
                      ==================================== */}

                      <Td className="text-right">

                        <Link
                          href={`/admin/${r.referenceId}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#111111]/10 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#222222] shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-150 hover:border-[#C59D3D]/50 hover:bg-[#FBF8F0] hover:text-[#8C6723]"
                        >
                          View request

                          <ArrowIcon />
                        </Link>

                      </Td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

          {/* =================================================
              TABLE FOOTER
          ================================================== */}

          {rows.length > 0 && (

            <div className="flex flex-col gap-2 border-t border-[#111111]/10 bg-[#FCFCFA] px-5 py-3.5 text-[9px] font-medium text-[#555555] sm:flex-row sm:items-center sm:justify-between sm:px-6">

              <span>
                Showing {rows.length}{' '}
                {rows.length === 1 ? 'request' : 'requests'}
              </span>

              <span>
                DEEN Care Global · Request Management
              </span>

            </div>

          )}

        </section>

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <footer className="flex flex-col gap-2 px-1 py-6 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#666666] sm:flex-row sm:items-center sm:justify-between">

          <Link href="/" aria-label="DEEN Care Global Foundation" className="inline-flex">
            <Logo className="h-14 w-auto" />
          </Link>

          <span>
            Administration Portal
          </span>

        </footer>

      </div>
    </main>
  )
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  label,
  value,
  description,
  icon,
  accent = false,
}: {
  label: string
  value: number
  description: string
  icon: React.ReactNode
  accent?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[18px] border bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-5 ${
        accent
          ? 'border-[#C59D3D]/25'
          : 'border-[#111111]/10'
      }`}
    >

      {accent && (
        <div className="absolute left-0 top-0 h-full w-[2px] bg-[#C59D3D]" />
      )}

      <div className="mb-5 flex items-start justify-between">

        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#444444]">
          {label}
        </span>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            accent
              ? 'bg-[#F5F0E4] text-[#8C6723]'
              : 'bg-[#F4F4F1] text-[#444444]'
          }`}
        >
          {icon}
        </div>

      </div>

      <div className="text-[28px] font-bold leading-none tracking-[-0.04em] text-[#111111] sm:text-[32px]">
        {value}
      </div>

      <p className="mt-2 text-[10px] font-medium text-[#555555]">
        {description}
      </p>

    </div>
  )
}

/* ============================================================
   TABLE HEADER
============================================================ */

function Th({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={`px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#333333] ${className}`}
    >
      {children}
    </th>
  )
}

/* ============================================================
   TABLE CELL
============================================================ */

function Td({
  children,
  className = '',
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <td
      className={`px-5 py-4 align-middle text-[11px] text-[#444444] ${className}`}
    >
      {children}
    </td>
  )
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}: {
  status: string
}) {
  const color = statusColor(status)

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-bold"
      style={{
        backgroundColor: `${color}0D`,
        borderColor: `${color}35`,
        color,
      }}
    >

      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />

      {statusLabel(status)}

    </span>
  )
}

/* ============================================================
   INITIALS
============================================================ */

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

/* ============================================================
   ICONS
============================================================ */

function RequestIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c3 3.5 3 14.5 0 18" />
      <path d="M12 3c-3 3.5-3 14.5 0 18" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}