import Image from 'next/image'
import { PageFrame, SectionHeading, Notice } from '@/components/site-shell'

export const metadata = {
  title: 'About | DEEN Care Global Foundation',
  description:
    'Learn about DEEN Care Global Foundation and our direct-support model.',
}

const HIGHLIGHTS = [
  'Need is considered with context, not assumptions.',
  'Every request is treated with privacy and respect.',
  'We communicate clearly, including when we cannot help.',
]

const VALUES = [
  { name: 'Compassion', desc: 'Empathy guides every single action and decision.' },
  { name: 'Dignity', desc: 'Preserving human respect above all procedures.' },
  { name: 'Transparency', desc: 'Clear boundaries and honest, open communication.' },
  { name: 'Integrity', desc: 'Responsible governance and ethical case evaluations.' },
  { name: 'Global Equality', desc: 'Support unconstrained by geography or circumstance.' },
]

export default function About() {
  return (
    <PageFrame crumbs={[{ label: 'About' }]}>
      <main 
        className="bg-white text-neutral-900 min-h-screen selection:bg-neutral-900 selection:text-white"
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        {/* Hero Section */}
        <section className="relative border-b border-neutral-200 py-24 sm:py-32">
          <div className="shell max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-widest text-neutral-600 border border-neutral-200 rounded-full mb-6">
              About DEEN Care
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-neutral-900 max-w-4xl leading-[1.1]">
              Assistance that begins with listening.
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-neutral-600 max-w-2xl font-normal leading-relaxed">
              We are a global humanitarian foundation focused on direct support for people facing genuine need.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 lg:py-28 border-b border-neutral-200 bg-white">
          <div className="shell max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Our story"
                title="A direct-support model, by design."
              />
            </div>

            <div className="lg:col-span-7 space-y-8 text-neutral-700 text-lg leading-relaxed">
              <p className="text-xl text-neutral-900 font-light">
                DEEN Care Global Foundation was established around a clear conviction: people should be able to ask for help without being made to feel small, exposed, or indebted.
              </p>
              <p className="text-neutral-600">
                Our work is intentionally direct. We do not accept donations from the public. Instead, we focus on understanding requests, reviewing them responsibly, and providing financial or practical support where we can.
              </p>

              <div className="mt-10 space-y-4 pt-8 border-t border-neutral-200">
                {HIGHLIGHTS.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="flex-shrink-0 text-neutral-900 font-mono text-sm mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span className="text-neutral-800 text-base sm:text-lg">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Values Section */}
        <section className="py-20 lg:py-28 border-b border-neutral-200 bg-neutral-50/60">
          <div className="shell max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            {/* Vision */}
            <div className="max-w-3xl">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Vision</span>
              <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 mt-3 mb-6">
                Our Vision
              </h2>
              <p className="text-xl sm:text-2xl text-neutral-700 font-light leading-relaxed border-l-2 border-neutral-900 pl-6 py-1">
                A world where access to compassionate, practical help is not determined by geography, circumstance, or the ability to ask perfectly.
              </p>
            </div>

            {/* Values Grid */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Principles</span>
              <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 mt-3 mb-10">
                Our Values
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {VALUES.map((val) => (
                  <div 
                    key={val.name} 
                    className="p-6 bg-white border border-neutral-200 hover:border-neutral-400 transition-colors duration-300 rounded-none shadow-sm"
                  >
                    <h3 className="font-medium text-neutral-900 text-lg mb-2">{val.name}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-24 lg:py-32 border-b border-neutral-200 bg-white">
          <div className="shell max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Leadership & Team
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-neutral-900 mt-3">
                Guiding the Mission
              </h2>
            </div>

            {/* Premium Minimalist Leadership Showcase */}
            <div className="relative overflow-hidden bg-neutral-50 border border-neutral-200 p-8 sm:p-12 lg:p-16 shadow-sm">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                
                {/* Image Showcase */}
                <div className="lg:col-span-5 flex justify-center lg:justify-start">
                  <div className="relative w-56 h-72 sm:w-64 sm:h-80 border border-neutral-300 p-2 bg-white shadow-sm">
                    <div className="relative w-full h-full transition-all duration-500">
                      <Image
                        src="/farha-2.png"
                        alt="Farha N Mirza"
                        fill
                        sizes="(max-width: 768px) 224px, 256px"
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Info & Statement */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-light text-neutral-900 tracking-wide">
                      Farha N Mirza
                    </h3>
                    <p className="text-sm font-mono text-neutral-500 uppercase tracking-widest mt-2">
                      DEEN Care Global Foundation
                    </p>
                  </div>

                  <div className="w-12 h-px bg-neutral-300" />

                  <p className="text-neutral-700 text-lg leading-relaxed font-light">
                    Directing compassionate humanitarian initiatives and upholding our commitment to direct, dignified support globally.
                  </p>

                  <div className="pt-2 text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Verified Foundation Leadership
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Notice Section */}
        <section className="py-16 bg-white">
          <div className="shell max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Notice />
          </div>
        </section>
      </main>
    </PageFrame>
  )
}