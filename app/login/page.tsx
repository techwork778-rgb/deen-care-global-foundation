import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PageFrame } from '@/components/site-shell'
import { SignInButton } from './sign-in-button'
import { Logo } from '@/components/logo'
import { getSession } from '@/lib/supabase/server'

export const metadata = {
  title: 'Sign in | DEEN Care Global Foundation',
  description: 'Sign in with Google to submit a request.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const session = await getSession()
  const { callbackUrl } = await searchParams

  if (session) {
    redirect(callbackUrl && callbackUrl.startsWith('/') ? callbackUrl : '/my-requests')
  }

  return (
    <PageFrame crumbs={[{ label: 'Sign in' }]}>
      <main className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#fafafa] dark:bg-[#09090b] overflow-hidden">
        
        {/* Subtle background ambient lighting */}
        <div 
          aria-hidden="true" 
          className="absolute inset-0 pointer-events-none flex justify-center items-center"
        >
          <div className="w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-[120px] rounded-full transform -translate-y-12" />
        </div>

        <div className="relative w-full max-w-md mx-auto">
          
          {/* Subtle Outer Glow Container */}
          <div className="relative rounded-3xl p-px bg-gradient-to-b from-slate-200/80 via-slate-200/20 to-slate-200/50 dark:from-slate-800/80 dark:via-slate-800/20 dark:to-slate-800/50 shadow-2xl shadow-slate-900/5 dark:shadow-black/40">
            
            {/* Card Content Shell */}
            <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[23px] p-8 sm:p-10">
              
              {/* Header */}
              <div className="text-center space-y-3">
                <Link href="/" className="mx-auto mb-2 inline-flex" aria-label="DEEN Care Global Foundation">
                  <Logo className="login-logo" />
                </Link>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  Welcome back
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Sign in with Google to continue your assistance request or manage existing submissions.
                </p>
              </div>

              {/* Action Area */}
              <div className="mt-8 space-y-6">
                <div className="p-0.5 rounded-xl bg-slate-100/50 dark:bg-zinc-800/50">
                  <SignInButton callbackUrl={callbackUrl} />
                </div>

                {/* Subtle Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-slate-100 dark:border-zinc-800/80" />
                  <span className="absolute bg-white dark:bg-zinc-900 px-3 text-[10px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                    Privacy Guarantee
                  </span>
                </div>

                {/* Micro Guarantee Note */}
                <p className="text-center text-[11px] leading-relaxed text-slate-400 dark:text-slate-500 px-2">
                  We strictly request basic profile credentials (name & email) to verify request integrity.
                </p>
              </div>

            </div>
          </div>

          {/* Minimalist Sub-footer */}
          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-600">
              Encrypted & Protected • DEEN Care Global Foundation
            </p>
          </div>

        </div>
      </main>
    </PageFrame>
  )
}