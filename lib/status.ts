// Canonical request statuses used across the app and admin dashboard.
export const REQUEST_STATUSES = [
  'NEW',
  'IN_PROGRESS',
  'COMPLETED',
  'REJECTED',
] as const

export type RequestStatus = (typeof REQUEST_STATUSES)[number]

export const STATUS_LABELS: Record<string, string> = {
  NEW: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

export function statusColor(status: string): string {
  switch (status) {
    case 'NEW':
      return '#6b7280'
    case 'IN_PROGRESS':
      return '#2563eb'
    case 'COMPLETED':
      return '#16a34a'
    case 'REJECTED':
      return '#dc2626'
    default:
      return '#6b7280'
  }
}
