import { Github, Mail, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'About', to: '/about' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms-of-service' },
      { label: 'Cookie Policy', to: '/cookie-policy' },
      { label: 'Security Policy', to: '/security-policy' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Phishing Analyzer', to: '/phishing' },
      { label: 'Image Detector', to: '/image-detector' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-navy-950/95">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-semibold text-white">PhishGuard AI</p>
              <p className="text-xs text-slate-500">Security analysis workspace</p>
            </div>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            A master thesis platform for phishing analysis, suspicious image review, role-based access, and security audit workflows.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="secondary-button py-2" to="/contact">
              <Mail size={16} />
              Contact
            </Link>
            <a className="secondary-button py-2" href="https://github.com/" target="_blank" rel="noreferrer">
              <Github size={16} />
              GitHub Repository
            </a>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">{section.title}</h2>
              <div className="mt-4 grid gap-2">
                {section.links.map((link) => (
                  <Link key={link.to} className="text-sm text-slate-500 transition hover:text-cyber-cyan" to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-slate-500">
        Copyright {new Date().getFullYear()} PhishGuard AI. Developed for academic research and security education.
      </div>
    </footer>
  )
}
