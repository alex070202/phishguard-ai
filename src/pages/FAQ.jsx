import PolicyLayout from '../components/PolicyLayout.jsx'

const questions = [
  ['How does phishing detection work?', 'The phishing module uses backend rules to evaluate sender domains, suspicious URLs, urgency language, Bulgarian scam phrases, sensitive data requests, and domain mismatch.'],
  ['How are AI-generated images analyzed?', 'Uploaded images are validated and analyzed through the image detection module. When the model service is running, PhishGuard AI uses a pretrained HuggingFace classifier to estimate the probability that an image is AI-generated. The final result combines the model prediction with metadata and forensic signals such as EXIF presence, software tags, dimensions, format and compression indicators.'],
  ['Is my uploaded data stored?', 'The platform stores analysis records and file metadata for dashboard history. Access is scoped by user role.'],
  ['Can I delete my history?', 'Yes. Logged-in users can delete their own scan history from the Dashboard using the Clear History option. The action only affects the current user’s phishing and image scan records and does not delete other users’ data. Administrative audit records may be preserved for security and abuse-prevention purposes.'],
  ['How accurate is the detection system?', 'Detection is probabilistic and should not be treated as absolute proof. Phishing results are rule-based security indicators, while image results combine model probability with metadata signals when the AI model service is available. High-risk results should still be reviewed by a human analyst.'],
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
