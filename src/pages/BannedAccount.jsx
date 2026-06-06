import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageMeta from '../components/PageMeta.jsx'

export default function BannedAccount() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-2xl text-center">
      <PageMeta title={t('errorsPages.bannedMeta')} description={t('errorsPages.bannedDescription')} />
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-white">{t('errorsPages.bannedTitle')}</h1>
        <p className="mt-4 text-slate-400">{t('errorsPages.bannedText')}</p>
        <Link className="secondary-button mt-6" to="/contact">{t('errorsPages.contactSupport')}</Link>
      </div>
    </section>
  )
}
