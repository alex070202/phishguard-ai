import PolicyLayout from '../components/PolicyLayout.jsx'

export default function CookiePolicy() {
  return (
    <PolicyLayout
      title="Cookie Policy"
      description="How local storage and browser-based preferences are used by PhishGuard AI."
    >
      <Section title="Authentication Storage">
        The application stores an authentication token locally after login so protected API requests can be made from the browser.
      </Section>
      <Section title="Cookie Consent Choice">
        The cookie banner stores whether a user accepted or declined the notice. This prevents the banner from appearing on every page load.
      </Section>
      <Section title="Security And Preferences">
        Browser storage is used only for session continuity and interface preferences in the current implementation.
      </Section>
      <Section title="Managing Storage">
        Users can clear browser storage at any time. Doing so will remove the local login state and cookie preference.
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
