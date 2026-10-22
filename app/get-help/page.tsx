import { PageFrame, Notice } from '@/components/site-shell'
import { HelpRequestForm } from '@/components/help-request-form'
import { getSession } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'Request Assistance | DEEN Care Global Foundation',
  description: 'Tell DEEN Care how we can help.',
}

export default async function GetHelp() {
  const user = await getSession()
  const meta = user?.user_metadata as { full_name?: string; name?: string } | undefined
  const defaults = {
    fullName: meta?.full_name || meta?.name || user?.email || undefined,
    email: user?.email || undefined,
  }

  return (
    <PageFrame crumbs={[{ label: 'Get help' }]}>
      <main className="relative min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-slate-900 dark:text-slate-100 overflow-hidden py-12 lg:py-20">
        
        {/* Ambient background glow */}
        <div 
          aria-hidden="true" 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section Header */}
          <div className="max-w-3xl space-y-4 mb-12 lg:mb-16">
            <div className="inline-flex items-center">
              <span className="px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 rounded-full">
                Request Assistance
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Tell us how we can help.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Your request is treated with complete dignity and confidentiality. Share only what feels necessary for us to understand your situation.
            </p>
          </div>

          {/* Two-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Guidance & Info */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Notice Component Wrapper */}
              <div className="rounded-2xl border border-slate-200/70 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-2">
                <Notice />
              </div>

              {/* Information Card Container */}
              <div className="relative rounded-3xl p-px bg-gradient-to-b from-slate-200/80 via-slate-200/30 to-slate-200/60 dark:from-zinc-800/80 dark:via-zinc-800/30 dark:to-zinc-800/60 shadow-xl shadow-slate-900/5 dark:shadow-black/40">
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[23px] p-6 sm:p-8 space-y-6">
                  
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      A clear, respectful process.
                    </h2>
                    <div className="w-12 h-0.5 bg-emerald-500/80 rounded-full mt-3" />
                  </div>

                  <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    <p>
                      We review every request carefully. We may ask for additional information, but we will <span className="font-semibold text-slate-900 dark:text-slate-100">never ask for money, bank details, or fees</span> to receive help.
                    </p>
                    <p>
                      Submitting a request does not guarantee assistance. We will be honest and transparent about what we can and cannot do.
                    </p>
                  </div>

                  {user?.email && (
                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        Signed in as <strong className="font-semibold text-slate-800 dark:text-slate-200">{user.email}</strong>
                      </span>
                      <Link 
                        href="/my-requests" 
                        className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline transition-all"
                      >
                        View my requests &rarr;
                      </Link>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Right Column: Premium Container wrapping HelpRequestForm */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl p-px bg-gradient-to-b from-slate-200/90 via-slate-200/30 to-slate-200/70 dark:from-zinc-800/90 dark:via-zinc-800/30 dark:to-zinc-800/70 shadow-2xl shadow-slate-900/5 dark:shadow-black/50">
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[23px] p-6 sm:p-10">
                  <HelpRequestForm defaults={defaults} />
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </PageFrame>
  )
}