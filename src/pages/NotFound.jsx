import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageMeta from '../components/PageMeta.jsx'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-2xl text-center">
      <PageMeta title={t('errorsPages.notFoundMeta')} description={t('errorsPages.notFoundDescription')} />
      <div className="panel p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">404</p>
        <h1 className="mt-3 text-4xl font-bold text-white">{t('errorsPages.notFoundTitle')}</h1>
        <p className="mt-4 text-slate-400">{t('errorsPages.notFoundText')}</p>
        <Link className="primary-button mt-6" to="/">{t('errorsPages.returnHome')}</Link>
      </div>
    </section>
  )
}
