/**
 * Next.js builds `request.url` from the process bind address (usually
 * localhost:3000) and `x-forwarded-proto`. Behind an HTTPS proxy that becomes
 * `https://localhost:3000/...` even though the browser is on the public site.
 * Auth redirects must follow the host the browser actually used.
 */

const INTERNAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1'])

function headerValue(value: string | null): string | null {
  const first = value?.split(',')[0]?.trim()
  return first || null
}

function hostnameOf(host: string): string {
  if (host.startsWith('[')) {
    const end = host.indexOf(']')
    return (end === -1 ? host : host.slice(1, end)).toLowerCase()
  }
  return host.split(':')[0].toLowerCase()
}

function isInternalHost(host: string): boolean {
  return INTERNAL_HOSTS.has(hostnameOf(host))
}

function originFromHost(host: string, proto: string | null): string {
  const normalizedProto = proto?.toLowerCase()
  const protocol = normalizedProto === 'http' || normalizedProto === 'https' ? normalizedProto : 'https'
  let normalizedHost = host
  if (protocol === 'https' && host.endsWith(':443')) normalizedHost = host.slice(0, -4)
  if (protocol === 'http' && host.endsWith(':80')) normalizedHost = host.slice(0, -3)
  return `${protocol}://${normalizedHost}`
}

/** Public site origin from APP_URL, ignoring localhost values. */
function configuredPublicOrigin(): string | null {
  const raw = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (!raw) return null
  try {
    const url = new URL(raw)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    if (isInternalHost(url.host)) return null
    return url.origin
  } catch {
    return null
  }
}

export function getPublicOrigin(request: { url: string; headers: { get(name: string): string | null } }): string {
  const forwardedProto = headerValue(request.headers.get('x-forwarded-proto'))
  const forwardedHost = headerValue(request.headers.get('x-forwarded-host'))
  const host = headerValue(request.headers.get('host'))

  // Prefer the host the browser requested. A public Host header is the site
  // the session cookie belongs to, so the redirect must stay there.
  if (host && !isInternalHost(host)) {
    return originFromHost(host, forwardedProto)
  }

  // Proxies sometimes leave Host as the upstream (localhost) and pass the
  // original host separately.
  if (forwardedHost && !isInternalHost(forwardedHost)) {
    return originFromHost(forwardedHost, forwardedProto)
  }

  const configured = configuredPublicOrigin()
  if (configured && process.env.NODE_ENV === 'production') {
    return configured
  }

  return new URL(request.url).origin
}
