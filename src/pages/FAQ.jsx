import PolicyLayout from '../components/PolicyLayout.jsx'
import { useTranslation } from 'react-i18next'

export default function FAQ() {
  const { t } = useTranslation()
  const questions = t('faq.items', { returnObjects: true })
  return (
    <PolicyLayout title={t('faq.title')} description={t('faq.description')}>
      <div className="grid gap-4">
        {questions.map((item) => (
          <section className="soft-panel p-5" key={item.question}>
            <h2 className="text-lg font-semibold text-white">{item.question}</h2>
            <p className="mt-3 leading-7 text-slate-400">{item.answer}</p>
          </section>
        ))}
      </div>
    </PolicyLayout>
  )
}
