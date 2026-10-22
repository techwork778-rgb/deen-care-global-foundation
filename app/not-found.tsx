import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageFrame } from '@/components/site-shell'
export default function NotFound(){return <PageFrame crumbs={[{label:'Page not found'}]}><main><section className="page-hero"><div className="shell"><p className="eyebrow">404</p><h1>This page could not be found.</h1><p>Let’s take you back to a useful place.</p><Link href="/" className="button" style={{marginTop:30}}><ArrowLeft size={16}/> Back home</Link></div></section></main></PageFrame>}
