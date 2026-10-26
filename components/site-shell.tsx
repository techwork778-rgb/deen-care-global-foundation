'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, ChevronRight, Home, Menu, X } from 'lucide-react'
import { navPrograms, notice } from '@/lib/site-data'
import { UserNav } from '@/components/user-nav'
import { SocialDock, SocialLinkList } from '@/components/social-links'
import { Logo } from '@/components/logo'

const ease = [0.22, 1, 0.36, 1] as const

const mobileLinks = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/how-we-help', 'How we help'],
  ['/transparency', 'Transparency'],
  ['/faq', 'FAQ'],
  ['/contact', 'Contact'],
] as const

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [programsOpen, setProgramsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 40); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  useEffect(() => { setOpen(false); setProgramsOpen(false) }, [pathname])
  const active = (href: string) => pathname === href
  return <header className={`floating-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="floating-nav">
      <Link href="/" className="brand" onClick={() => setOpen(false)}>
        <Logo priority variant="on-dark" className="brand-mark" />
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {['/'].map(href => <Link key={href} href={href} className={active(href) ? 'active' : ''}>Home{active(href) && <motion.i layoutId="active-nav" />}</Link>)}
        <Link href="/about" className={active('/about') ? 'active' : ''}>About{active('/about') && <motion.i layoutId="active-nav" />}</Link>
        <div className="mega-trigger"><button type="button" onClick={() => setProgramsOpen(!programsOpen)} aria-expanded={programsOpen} aria-haspopup="true">Programs <ChevronDown size={14} /></button>{programsOpen && <MegaMenu close={() => setProgramsOpen(false)} />}</div>
        {['/how-we-help','/contact'].map((href) => <Link key={href} href={href} className={active(href) ? 'active' : ''}>{href.slice(1).replaceAll('-', ' ')}{active(href) && <motion.i layoutId="active-nav" />}</Link>)}
        <Link href="/get-help" className="header-cta">Request assistance <ArrowUpRight size={15} /></Link>
        <UserNav />
      </nav>
      <button className="mobile-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
    <AnimatePresence>{open && <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="mobile-menu-inner"><div className="mobile-links">{mobileLinks.map(([href, label], i) => <motion.div key={href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}><Link href={href} onClick={() => setOpen(false)}>{label}</Link></motion.div>)}<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}><button type="button" className="mobile-program-toggle" onClick={() => setProgramsOpen(!programsOpen)} aria-expanded={programsOpen}>Programs <ChevronDown /></button>{programsOpen && <div className="mobile-programs">{navPrograms.map(p => <Link key={p.slug} href={`/programs/${p.slug}`} onClick={() => setOpen(false)}>{p.title}</Link>)}<Link href="/programs" onClick={() => setOpen(false)}>All programs</Link></div>}</motion.div></div><Link href="/get-help" className="button button-light mobile-cta" onClick={() => setOpen(false)}>Request assistance <ArrowUpRight size={17} /></Link><div className="mobile-user-nav"><UserNav /></div></div></motion.div>}</AnimatePresence>
  </header>
}

function MegaMenu({ close }: { close: () => void }) { return <motion.div className="mega-menu" initial={{ opacity: 0, y: 8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .2, ease }}><div className="mega-grid">{navPrograms.map((p, i) => <Link key={p.slug} href={`/programs/${p.slug}`} onClick={close}><span>0{i + 1}</span><strong>{p.title}</strong><small>{p.short}</small><ChevronRight /></Link>)}</div><Link href="/get-help" className="mega-footer" onClick={close}>Need help now? Request assistance <ArrowUpRight size={15} /></Link></motion.div> }

function FrameOverlays() { return <><div className="frame-base" /><div className="frame-gradient" /><div className="frame-vignette" /><svg className="frame-noise" aria-hidden="true"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" /></filter><rect width="100%" height="100%" filter="url(#grain)" /></svg><div className="frame-grid" aria-hidden="true" /></> }

export function PageBanner({ eyebrow = 'DEEN CARE GLOBAL FOUNDATION', title, description, breadcrumbs, image = '/images/deen-care-community.png', index = '02' }: { eyebrow?: string; title: string; description?: string; breadcrumbs: { label: string; href?: string }[]; image?: string; index?: string }) { return <section className="page-banner-frame"><div className="frame-image-wrap"><Image src={image} alt="People supporting one another in a calm community setting" fill sizes="100vw" className="frame-image" /></div><FrameOverlays /><div className="banner-content"><div className="banner-main"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/" aria-label="Home"><Home size={14} /></Link>{breadcrumbs.map((item, i) => <span key={`${item.label}-${i}`}><ChevronRight size={13} />{item.href ? <Link href={item.href}>{item.label}</Link> : <strong aria-current="page">{item.label}</strong>}</span>)}</nav><p className="eyebrow banner-eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="banner-description">{description}</p>}</div><div className="banner-index" aria-hidden="true">{index}</div></div><div className="banner-rule" /></section> }
export const Breadcrumbs = ({ items, ...props }: { items: { label: string; href?: string }[]; image?: string; description?: string; index?: string }) => <PageBanner {...props} breadcrumbs={items} title={items.at(-1)?.label ?? 'Page'} />

export function Footer() { return <footer className="site-footer"><div className="shell footer-grid"><div><Link href="/" className="brand footer-brand"><Logo variant="on-dark" className="footer-mark" /></Link><p className="footer-copy">Direct assistance, offered with dignity to people who genuinely need it.</p><p className="footer-notice">{notice}</p><div className="footer-social"><h3>Social</h3><SocialLinkList className="footer-social-links" /></div></div><div><h3>Explore</h3><Link href="/about">About us</Link><Link href="/how-we-help">How we help</Link><Link href="/transparency">Transparency</Link><Link href="/faq">FAQ</Link></div><div><h3>Programs</h3>{navPrograms.slice(0, 5).map(p => <Link key={p.slug} href={`/programs/${p.slug}`}>{p.title}</Link>)}<Link href="/programs">View all programs</Link></div><div><h3>Contact & legal</h3><Link href="/get-help">Request assistance</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms</Link></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} DEEN Care Global Foundation</span><a href="#top">Back to top ↑</a></div><SocialDock /></footer> }
export function PageFrame({ children, crumbs, image }: { children: React.ReactNode; crumbs?: { label: string; href?: string }[]; image?: string }) { return <><Header />{crumbs && <PageBanner breadcrumbs={crumbs} image={image} title={crumbs.at(-1)?.label ?? 'Page'} />}{children}<Footer /></> }
export function SectionHeading({ eyebrow, title, text, align = 'left' }: { eyebrow?: string; title: string; text?: string; align?: 'left' | 'center' }) { return <div className={`section-heading ${align === 'center' ? 'centered' : ''}`}>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{text && <p>{text}</p>}</div> }
export function Notice() { return <div className="notice"><strong>A note about donations</strong><span>{notice}</span></div> }

export function HeroFrame() { return null }
