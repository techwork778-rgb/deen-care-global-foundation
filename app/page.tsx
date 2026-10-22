import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check, Globe2, HeartHandshake, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Footer, Header, Notice, SectionHeading } from '@/components/site-shell'
import { PremiumHero } from '@/components/premium-hero'
import { programs } from '@/lib/site-data'

export const metadata = { title: 'DEEN Care Global Foundation | Help, given directly', description: 'Direct financial assistance and practical support for people who genuinely need it, anywhere in the world.' }

export default function Home() { return <div id="top"><Header /><main>
  <section className="hero-frame-wrapper">
  <PremiumHero />
</section>
  {/* <section className="trust-strip"><div className="shell trust-grid">{[[Globe2,'Global reach'],[HeartHandshake,'Direct support'],[ShieldCheck,'No donations accepted'],[LockKeyhole,'Confidential requests']].map(([Icon,label]) => <div className="trust-item" key={label as string}><Icon size={18} /><span>{label as string}</span></div>)}</div></section> */}
  <section className="section intro-section"><div className="shell two-col"><SectionHeading eyebrow="Our purpose" title="Practical care, without the noise." text="DEEN Care exists to make a simple promise meaningful: when someone is facing genuine hardship, they deserve to be met with respect and practical help." /><div className="large-statement"><p>We focus our energy on understanding need, reviewing requests carefully, and providing direct support where we can.</p><Link href="/about" className="text-link">Learn about our approach <ArrowRight size={16} /></Link></div></div></section>
  <section className="section light-section"><div className="shell"><SectionHeading eyebrow="Our programs" title="Support for the moments that matter." text="Explore the areas where we may be able to provide direct assistance." /><div className="program-grid">{programs.map((p,i) => <Link href={`/programs/${p.slug}`} className="program-card" key={p.slug}><span className="card-number">0{i+1}</span><h3>{p.title}</h3><p>{p.short}</p><span className="card-arrow"><ArrowUpRight size={18} /></span></Link>)}</div><Link href="/programs" className="button button-outline centered-button">View all programs <ArrowRight size={16} /></Link></div></section>
  <section className="section"><div className="shell"><SectionHeading eyebrow="A clear process" title="What happens when you reach out?" text="A straightforward process designed to protect your dignity and help us understand what you need." /><div className="steps">{['Submit your request','Careful review','Verification, if needed','Support delivered'].map((step,i) => <div className="step" key={step}><span>0{i+1}</span><h3>{step}</h3><p>{['Share your situation through our secure form.','We read every request with care and context.','We may contact you to understand the need more clearly.','If approved, we explain the next steps clearly.'][i]}</p></div>)}</div></div></section>
  <section className="section black-section"><div className="shell two-col values-layout"><div><p className="eyebrow light">What guides us</p><h2>Care should feel like care.</h2><p>Our work is shaped by the belief that how assistance is given matters as much as what is given.</p></div><div className="values-list">{['Compassion','Dignity','Transparency','Integrity','Global equality'].map(v => <div key={v}><Check size={17} />{v}</div>)}</div></div></section>
  <section className="section"><div className="shell"><Notice /></div></section>
  <section className="cta-banner"><div className="shell cta-inner"><div><p className="eyebrow light">Here when you need us</p><h2>If you or someone you know needs help, reach out.</h2></div><Link href="/get-help" className="button button-light">Request assistance <ArrowUpRight size={17} /></Link></div></section>
</main><Footer /></div> }
