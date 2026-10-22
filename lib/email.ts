import nodemailer from 'nodemailer'

type RequestNotificationInput = {
  referenceId: string
  fullName: string
  email: string
  phone: string
  country: string
  city?: string | null
  assistanceType: string
  description: string
  additionalInfo?: string | null
  createdAt: Date
  adminUrl: string
}

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  if (!host || !user || !pass) {
    throw new Error('SMTP_HOST, SMTP_USER and SMTP_PASSWORD must be configured.')
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

const AMP = '\u0026' // "&" — built via escape to avoid entity collapsing
const HTML_ENTITIES: Record<string, string> = {
  '&': AMP + 'amp;',
  '<': AMP + 'lt;',
  '>': AMP + 'gt;',
  '"': AMP + 'quot;',
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => HTML_ENTITIES[c])
}

function formatDateTime(d: Date): string {
  return (
    d.toLocaleString('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'UTC',
    }) + ' (UTC)'
  )
}

function buildAdminNotificationHtml(input: RequestNotificationInput): string {
  const rows: [string, string][] = [
    ['Reference ID', input.referenceId],
    ['Submitted', formatDateTime(input.createdAt)],
    ['Name', input.fullName],
    ['Email', input.email],
    ['Phone', input.phone],
    ['Country', input.country],
    ['City', input.city || '—'],
    ['Assistance type', input.assistanceType],
  ]
  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#6b7280;font-weight:600;white-space:nowrap">${escapeHtml(
          k,
        )}</td><td style="padding:6px 12px;color:#111827">${escapeHtml(v)}</td></tr>`,
    )
    .join('')
  return `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;background:#f9fafb;margin:0;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="padding:20px 24px;background:#111827;color:#fff"><img src="${escapeHtml(new URL(input.adminUrl).origin)}/logo-white.png" alt="DEEN Care Global Foundation" width="160" style="display:block;width:160px;height:auto;border:0" /><div style="opacity:.8;font-size:13px;margin-top:12px">New assistance request received</div></div>
    <div style="padding:20px 24px">
      <table style="border-collapse:collapse;width:100%;font-size:14px">${rowsHtml}</table>
      <h3 style="margin:20px 0 6px;font-size:14px;color:#374151">Request details</h3>
      <p style="white-space:pre-wrap;background:#f3f4f6;border-radius:8px;padding:12px;font-size:14px;margin:0">${escapeHtml(
        input.description,
      )}</p>
      ${
        input.additionalInfo
          ? `<h3 style="margin:16px 0 6px;font-size:14px;color:#374151">Additional information</h3><p style="white-space:pre-wrap;background:#f3f4f6;border-radius:8px;padding:12px;font-size:14px;margin:0">${escapeHtml(
              input.additionalInfo,
            )}</p>`
          : ''
      }
      <a href="${escapeHtml(input.adminUrl)}" style="display:inline-block;margin-top:20px;background:#111827;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:14px">View & manage this request</a>
      <p style="margin-top:14px;font-size:12px;color:#6b7280">Or paste this link: ${escapeHtml(input.adminUrl)}</p>
    </div>
  </div>
</body></html>`
}

function buildAdminNotificationText(input: RequestNotificationInput): string {
  return [
    'DEEN Care Global Foundation — new assistance request',
    '',
    `Reference ID: ${input.referenceId}`,
    `Submitted:    ${formatDateTime(input.createdAt)}`,
    `Name:         ${input.fullName}`,
    `Email:        ${input.email}`,
    `Phone:        ${input.phone}`,
    `Country:      ${input.country}`,
    `City:         ${input.city || '—'}`,
    `Type:         ${input.assistanceType}`,
    '',
    'Request details:',
    input.description,
    '',
    input.additionalInfo ? `Additional information:\n${input.additionalInfo}\n` : '',
    `Manage this request: ${input.adminUrl}`,
  ].join('\n')
}

export async function sendAdminRequestNotification(
  input: RequestNotificationInput,
): Promise<void> {
  const to = process.env.ADMIN_EMAIL
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  if (!to) throw new Error('ADMIN_EMAIL must be configured.')
  const transporter = getTransporter()
  await transporter.sendMail({
    from,
    to,
    subject: `New assistance request — ${input.referenceId}`,
    text: buildAdminNotificationText(input),
    html: buildAdminNotificationHtml(input),
  })
}
