import PolicyLayout from '../components/PolicyLayout.jsx'

export default function SecurityPolicy() {
  return (
    <PolicyLayout
      title="Security Policy"
      description="Security practices, account protections, and responsible disclosure guidance for PhishGuard AI."
    >
      <Section title="Account Security">
        Users should choose strong passwords and sign out on shared machines. Administrative features are protected by role-based middleware.
      </Section>
      <Section title="Password Handling">
        Passwords are hashed before storage. The application never needs to read or display a plain user password.
      </Section>
      <Section title="JWT Authentication">
        API requests to protected resources require a valid token. Dashboard and admin data are filtered by authenticated user and role.
      </Section>
      <Section title="Data Protection">
        Analysis results are stored with ownership metadata so regular users see only their own history.
      </Section>
      <Section title="Detection Limitations">
        Phishing and image analysis results should be treated as security signals. They do not replace professional incident response or forensic review.
      </Section>
      <Section title="Responsible Disclosure">
        Security issues should be reported through the contact page with clear reproduction steps and affected components.
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
