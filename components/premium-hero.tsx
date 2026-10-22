'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, CircleCheck, RotateCw } from 'lucide-react'
import { programs } from '@/lib/site-data'

const ease = [0.22, 1, 0.36, 1] as const
const rise = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: .8, ease } } }

export function PremiumHero() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const imageY = useTransform(scrollYProgress, [0, .35], ['0%', '8%'])
  return <motion.section className="hero-frame" initial={{ opacity: 0, scale: reduce ? 1 : .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease }}>
    <motion.div className="frame-image-wrap hero-image-wrap" style={reduce ? undefined : { y: imageY }}><Image src="/images/deen-care-community.png" alt="People supporting one another in a calm community setting" fill priority sizes="100vw" quality={82} className="frame-image" /></motion.div>
    <FrameOverlays />
    <div className="hero-content shell"><motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .12, delayChildren: .25 } } }}><motion.p className="eyebrow hero-eyebrow" variants={rise}>GLOBAL HUMANITARIAN FOUNDATION</motion.p><div className="hero-title-mask"><motion.h1 variants={{ hidden: { opacity: 0, y: '110%' }, visible: { opacity: 1, y: 0, transition: { duration: .9, ease } } }}>Help, given <em>directly.</em><br /><span>To those who need it most.</span></motion.h1></div><motion.p className="hero-text" variants={rise}>We provide direct financial assistance and practical support to people facing genuine need — with dignity, care, and clarity.</motion.p><motion.div className="hero-actions" variants={rise}><Link href="/get-help" className="button button-light">Request assistance <ArrowUpRight size={17} /></Link><Link href="/how-we-help" className="hero-ghost">How we help <ArrowRight size={16} /></Link></motion.div><motion.p className="hero-reassurance" variants={rise}><CircleCheck size={15} /> No fees. No donations. Every request handled in confidence.</motion.p></motion.div></div>
    <motion.div className="hero-badge" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}><RotateCw size={18} /><span>NO DONATIONS ACCEPTED · DIRECT SUPPORT ·</span></motion.div>
    <div className="process-bar">{['Submit a request','Review with care','Verify privately','Support delivered directly'].map((item, i) => <div key={item}><span>0{i + 1}</span><p>{item}</p></div>)}</div><div className="scroll-cue"><span>Scroll</span><i /></div><div className="hero-marquee"><div>{[...programs, ...programs].map((p, i) => <span key={`${p.slug}-${i}`}>{p.title}<b>•</b></span>)}</div></div>
  </motion.section>
}

function FrameOverlays() { return <><div className="frame-base" /><div className="frame-gradient" /><div className="frame-vignette" /><svg className="frame-noise" aria-hidden="true"><filter id="hero-grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" /></filter><rect width="100%" height="100%" filter="url(#hero-grain)" /></svg><div className="frame-grid" aria-hidden="true" /></> }
