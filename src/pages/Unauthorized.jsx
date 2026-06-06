import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageMeta from '../components/PageMeta.jsx'

export default function Unauthorized() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-2xl text-center">
      <PageMeta title={t('errorsPages.unauthorizedMeta')} description={t('errorsPages.unauthorizedDescription')} />
      <div className="panel p-8">
        <h1 className="text-3xl font-bold text-white">{t('errorsPages.unauthorizedTitle')}</h1>
        <p className="mt-4 text-slate-400">{t('errorsPages.unauthorizedText')}</p>
        <Link className="primary-button mt-6" to="/login">{t('auth.goLogin')}</Link>
      </div>
    </section>
  )
}
