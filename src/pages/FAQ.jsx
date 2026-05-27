import PolicyLayout from '../components/PolicyLayout.jsx'

const questions = [
  ['How does phishing detection work?', 'The phishing module uses backend rules to evaluate sender domains, suspicious URLs, urgency language, Bulgarian scam phrases, sensitive data requests, and domain mismatch.'],
  ['How are AI-generated images analyzed?', 'The current image module validates uploads and checks file-level indicators. It is structured so a real AI-image model can be added later.'],
  ['Is my uploaded data stored?', 'The platform stores analysis records and file metadata for dashboard history. Access is scoped by user role.'],
  ['Can I delete my history?', 'A production deployment should expose account and history deletion workflows. The current thesis implementation focuses on protected storage and admin review.'],
  ['How accurate is the detection system?', 'The current results are rule-based indicators. They are useful for demonstration and workflow validation, but should not be treated as final forensic conclusions.'],
  ['Who can access dashboard data?', 'Regular users can access only their own records. Admin users can review global checks and logs through the admin panel.'],
]

export default function FAQ() {
  return (
    <PolicyLayout title="FAQ" description="Common questions about PhishGuard AI analysis, storage, accuracy, and dashboard access.">
      <div className="grid gap-4">
        {questions.map(([question, answer]) => (
          <section className="soft-panel p-5" key={question}>
            <h2 className="text-lg font-semibold text-white">{question}</h2>
            <p className="mt-3 leading-7 text-slate-400">{answer}</p>
          </section>
        ))}
      </div>
    </PolicyLayout>
  )
}
