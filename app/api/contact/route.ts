import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db, contactMessages } from '@/lib/db'
const schema=z.object({name:z.string().trim().min(2).max(120),email:z.string().email(),subject:z.string().trim().min(2).max(160),message:z.string().trim().min(10).max(5000)})
export async function POST(request:Request){try{const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:'Please check your details and try again.'},{status:400});await db.insert(contactMessages).values({id:crypto.randomUUID(),...parsed.data});return NextResponse.json({ok:true},{status:201})}catch{return NextResponse.json({error:'Unable to send your message right now.'},{status:500})}}
