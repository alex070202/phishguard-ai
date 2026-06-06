import { FileSearch, Image, ShieldAlert, Workflow } from 'lucide-react'
import FeatureCard from '../components/FeatureCard.jsx'
import Hero from '../components/Hero.jsx'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  return (
    <div className="space-y-10">
      <Hero />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">{t('home.modulesEyebrow')}</p>
          <h2 className="mt-3 text-3xl font-bold text-white">{t('home.modulesTitle')}</h2>
          <p className="mt-4 leading-7 text-slate-400">
            {t('home.modulesDescription')}
          </p>
        </div>
        <div className="grid gap-5 lg:col-span-2 md:grid-cols-2">
          <FeatureCard
            icon={FileSearch}
            title={t('home.phishingTitle')}
            description={t('home.phishingDescription')}
            to="/phishing"
            accent="cyan"
          />
          <FeatureCard
            icon={Image}
            title={t('home.imageTitle')}
            description={t('home.imageDescription')}
            to="/image-detector"
            accent="green"
          />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="panel p-6">
          <ShieldAlert className="text-cyber-red" size={28} />
          <h3 className="mt-4 text-xl font-semibold text-white">{t('home.operationalTitle')}</h3>
          <p className="mt-3 leading-7 text-slate-400">
            {t('home.operationalDescription')}
          </p>
        </div>
        <div className="panel p-6">
          <Workflow className="text-cyber-cyan" size={28} />
          <h3 className="mt-4 text-xl font-semibold text-white">{t('home.servicesTitle')}</h3>
          <p className="mt-3 leading-7 text-slate-400">
            {t('home.servicesDescription')}
          </p>
        </div>
      </section>
    </div>
  )
}
