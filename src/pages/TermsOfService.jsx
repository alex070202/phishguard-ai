import PolicyLayout from '../components/PolicyLayout.jsx'

export default function TermsOfService() {
  return (
    <PolicyLayout
      title="Terms of Service"
      description="Rules for using PhishGuard AI as a security analysis and academic demonstration platform."
    >
      <Section title="Acceptable Use">
        Users may use the platform to analyze suspicious messages and image files for educational, research, and defensive security purposes.
      </Section>
      <Section title="Prohibited Use">
        The platform must not be used to create phishing campaigns, harass users, upload harmful content, or attempt unauthorized access to accounts or administrative tools.
      </Section>
      <Section title="Analysis Limitations">
        Rule-based results are indicators, not final legal or forensic conclusions. Users should verify high-impact decisions with additional security tools and expert review.
      </Section>
      <Section title="Moderation Rights">
        Administrators may suspend or ban accounts that abuse the system, attempt to bypass controls, or submit harmful content.
      </Section>
      <Section title="Liability">
        PhishGuard AI is developed as a thesis project and should be treated as a research implementation rather than a commercial security guarantee.
      </Section>
    </PolicyLayout>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 leading-7 text-slate-400">{children}</p>
    </section>
  )
}
