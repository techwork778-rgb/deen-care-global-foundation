export type Program = { slug: string; title: string; short: string; description: string; support: string[]; audience: string }

export const programs: Program[] = [
  { slug: 'education-support', title: 'Education support', short: 'Creating room to learn, grow, and choose a different future.', description: 'Direct assistance for learners whose circumstances make education difficult to access or continue.', audience: 'Students, learners, and families facing barriers to education.', support: ['School fees and learning materials', 'Transport and essential study needs', 'Short-term support to stay enrolled'], },
  { slug: 'medical-healthcare-assistance', title: 'Medical & healthcare assistance', short: 'Helping people access essential care with dignity.', description: 'Support for urgent and essential healthcare needs when cost is preventing someone from receiving care.', audience: 'People and families managing urgent or essential medical needs.', support: ['Treatment and consultation costs', 'Medication and recovery essentials', 'Travel for necessary care'], },
  { slug: 'family-financial-assistance', title: 'Family financial assistance', short: 'Practical support through moments of financial difficulty.', description: 'Short-term, direct assistance for households navigating an immediate financial hardship.', audience: 'Households experiencing a significant and verifiable hardship.', support: ['Essential household costs', 'Housing and utility needs', 'Stabilisation after a sudden loss'], },
  { slug: 'child-support', title: 'Child support', short: 'Protecting the wellbeing and potential of children.', description: 'Focused support that helps children stay safe, healthy, and connected to care and education.', audience: 'Children and the trusted adults responsible for their care.', support: ['Education and care essentials', 'Health and safety needs', 'Family stabilisation support'], },
  { slug: 'emergency-assistance', title: 'Emergency assistance', short: 'A calm, practical response when circumstances change suddenly.', description: 'Direct assistance for immediate needs following an emergency, displacement, or unexpected crisis.', audience: 'Individuals and families facing an urgent, time-sensitive need.', support: ['Emergency shelter and essentials', 'Immediate travel and safety needs', 'Short-term crisis support'], },
  { slug: 'food-and-essentials', title: 'Food & essentials', short: 'Meeting the essentials that make daily life possible.', description: 'Direct help with food, hygiene, and other basic necessities when they are not accessible.', audience: 'People and families without reliable access to daily essentials.', support: ['Food and household supplies', 'Hygiene and care items', 'Essential clothing and supplies'], },
  { slug: 'vulnerable-individuals-and-families', title: 'Vulnerable individuals & families', short: 'Standing alongside people who face compounding barriers.', description: 'Holistic assistance for people whose circumstances make it harder to access support elsewhere.', audience: 'People experiencing vulnerability, isolation, displacement, or exclusion.', support: ['Needs-based direct assistance', 'Connection to local services', 'Essential stabilisation support'], },
  { slug: 'humanitarian-initiatives', title: 'Humanitarian initiatives', short: 'Responding thoughtfully to needs across communities.', description: 'Carefully reviewed initiatives that address clear humanitarian needs directly and responsibly.', audience: 'Communities experiencing a defined humanitarian need.', support: ['Essential relief initiatives', 'Community-led response', 'Time-bound humanitarian action'], },
]

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
