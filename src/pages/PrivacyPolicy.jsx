import PolicyLayout from '../components/PolicyLayout.jsx'

export default function PrivacyPolicy() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      description="How PhishGuard AI handles accounts, scan history, uploaded files, authentication data, and user rights."
    >
      <Section title="Account Data">
        We store account information required for login, role-based access, and dashboard ownership. Passwords are stored as hashes and are never displayed by the application.
      </Section>
      <Section title="Scan History">
        Phishing checks and image checks are stored so users can review previous results. Regular users can access only their own records, while administrators can review platform-wide records for moderation and academic demonstration.
      </Section>
      <Section title="Image Uploads">
        Uploaded images are processed for validation and analysis metadata. The current workflow stores file information and analysis results, not a public gallery of uploaded content.
      </Section>
      <Section title="Authentication And Sessions">
        The frontend stores an authentication token locally so users can access protected pages. Users should sign out on shared devices.
      </Section>
      <Section title="User Rights">
        Users may request account review, correction of inaccurate data, or removal of stored analysis records in a production deployment.
      </Section>
      <Section title="Security Practices">
        The platform uses authentication, role checks, password hashing, and audit logs to reduce unauthorized access risk.
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
