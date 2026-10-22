import type { MetadataRoute } from 'next'
import { programs } from '@/lib/site-data'
export default function sitemap():MetadataRoute.Sitemap{const base='https://deencare.org'; return['','about','programs','how-we-help','transparency','faq','get-help','contact','privacy','terms',...programs.map(p=>`programs/${p.slug}`)].map(path=>({url:`${base}/${path}`,lastModified:new Date()}))}
