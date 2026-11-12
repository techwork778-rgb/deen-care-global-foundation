export type Program = { slug: string; title: string; short: string; description: string; support: string[]; audience: string }


export const programs: Program[] = [
  {
    slug: 'education-support',
    title: 'Education Support',
    short:
      'Creating opportunities through education and empowering brighter futures.',
    description:
      'Every individual deserves the opportunity to learn, grow, and achieve their potential. Our Education Support program helps children and young learners overcome financial and social barriers to education, ensuring that difficult circumstances do not stand in the way of their dreams.',
    audience:
      'Underprivileged students, children from low-income families, and young learners facing barriers to quality education.',
    support: [
      'School fees, uniforms, books, and essential learning materials',
      'Educational assistance for children from disadvantaged backgrounds',
      'Support to help students continue their education and pursue their aspirations',
    ],
  },
  {
    slug: 'childrens-orphanage',
    title: "Children's Orphanage",
    short:
      'Providing a safe haven where every child feels valued, protected, and loved.',
    description:
      'Every child deserves a place to feel safe, supported, and cared for. Our Children’s Orphanage program focuses on supporting orphaned and vulnerable children through safe living environments, essential care, education, and emotional guidance. We strive to create opportunities for children to grow with confidence, discover their potential, and move toward a future filled with dignity, stability, and hope.',
    audience:
      'Orphaned, abandoned, and vulnerable children who require safe shelter, compassionate care, educational opportunities, and long-term support.',
    support: [
      'Safe shelter, nutritious meals, clothing, and essential daily care',
      'Access to education, healthcare, and emotional wellbeing support',
      'A nurturing environment that encourages personal growth, confidence, and independence',
    ],
  },
  {
    slug: 'child-support',
    title: 'Child Support',
    short:
      'Every child deserves love, protection, and the opportunity to thrive.',
    description:
      'Every child deserves a childhood filled with safety, care, dignity, and hope. Our Child Support program is dedicated to uplifting vulnerable and underprivileged children by addressing their essential needs, supporting their emotional and physical wellbeing, and helping them build a foundation for a brighter future. We believe that supporting a child today can transform a life tomorrow.',
    audience:
      'Vulnerable children, children from financially struggling families, and young individuals facing neglect, hardship, or limited access to essential care and opportunities.',
    support: [
      'Essential nutrition, clothing, hygiene, and everyday necessities',
      'Access to healthcare, emotional wellbeing, and child protection support',
      'Educational resources, personal development, and opportunities for a better future',
    ],
  },
  
];


export const faqs = [
  ['Do you accept donations?', 'No. DEEN Care Global Foundation does not accept donations through this website or from the public. We directly provide assistance to people who are genuinely in need.'],
  ['Who can apply?', 'Anyone who is experiencing a genuine need may submit a request. You may also submit on behalf of a child or someone you support.'],
  ['Is there a fee to apply?', 'Never. There is no application fee, processing fee, or payment required to receive help.'],
  ['How long does it take?', 'We aim to respond within 5 working days. More complex requests may require additional time for careful review and verification.'],
  ['Is my information kept private?', 'We treat requests with confidentiality and only use information for review, verification, and communication about the request.'],
  ['Do you help people outside my country?', 'Yes. We consider requests from anywhere in the world, subject to our review process and ability to provide direct support.'],
  ['What happens after I apply?', 'We review the information, may contact you for clarification, and let you know the next step. Submitting a request does not guarantee assistance.'],
  ['What kinds of support can you provide?', 'Support may include education, healthcare, food and essentials, emergency assistance, and other needs described in our programs.'],
  ['Can I apply for someone else?', 'Yes. Please explain your relationship to the person and make sure the information you provide is accurate.'],
  ['How do I report a suspicious message?', 'We never ask for fees, payments, bank details, or gift cards. If someone does, do not respond and contact us through the official Contact page.'],
]

export const notice = 'DEEN Care Global Foundation does not accept donations through this website. We will never ask you for money, bank details, or fees to receive help.'

/** Placeholder profiles. Swap these for the live accounts when they are ready. */
export const socialLinks = [
  { id: 'facebook', name: 'Facebook', href: 'https://facebook.com/deencare' },
  { id: 'instagram', name: 'Instagram', href: 'https://instagram.com/deencare' },
  { id: 'x', name: 'X', href: 'https://x.com/deencare' },
  { id: 'linkedin', name: 'LinkedIn', href: 'https://linkedin.com/company/deencare' },
  { id: 'youtube', name: 'YouTube', href: 'https://youtube.com/@deencare' },
  { id: 'whatsapp', name: 'WhatsApp', href: 'https://wa.me/10000000000' },
  { id: 'tiktok', name: 'TikTok', href: 'https://tiktok.com/@deencare' },
] as const

export const navPrograms = programs.map(({ slug, title }) => ({ slug, title }))

export function getProgram(slug: string) { return programs.find((program) => program.slug === slug) }

export function makeReferenceId() { return `DCGF-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}` }
