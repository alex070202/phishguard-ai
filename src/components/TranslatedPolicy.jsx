import { useTranslation } from 'react-i18next'
import PolicyLayout from './PolicyLayout.jsx'

export default function TranslatedPolicy({ policyKey }) {
  const { t } = useTranslation()
  const sections = t(`policies.${policyKey}.sections`, { returnObjects: true })

  return (
    <PolicyLayout
      title={t(`policies.${policyKey}.title`)}
      description={t(`policies.${policyKey}.description`)}
    >
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-semibold text-white">{section.title}</h2>
          <p className="mt-3 leading-7 text-slate-400">{section.text}</p>
        </section>
      ))}
    </PolicyLayout>
  )
}
