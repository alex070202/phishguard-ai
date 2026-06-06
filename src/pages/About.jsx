import { Cpu, Database, GraduationCap, Layers3, MailSearch, ScanEye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ResultCard from '../components/ResultCard.jsx'

const technologies = ['React', 'Vite', 'Tailwind CSS', 'React Router', 'Express', 'MySQL', 'Multer']

export default function About() {
  const { t } = useTranslation()
  return (
    <div className="space-y-8">
      <section className="panel p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">{t('about.eyebrow')}</p>
            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{t('about.title')}</h1>
            <p className="mt-5 max-w-3xl leading-8 text-slate-300">
              {t('about.description')}
            </p>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-cyber-cyan/25 bg-cyber-cyan/10 text-cyber-cyan">
            <GraduationCap size={34} />
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <ResultCard icon={MailSearch} title={t('about.phishingTitle')} tone="red">
          {t('about.phishingText')}
        </ResultCard>
        <ResultCard icon={ScanEye} title={t('about.imageTitle')} tone="green">
          {t('about.imageText')}
        </ResultCard>
      </section>

      <section className="panel p-7">
        <div className="flex items-center gap-3">
          <Layers3 className="text-cyber-cyan" size={24} />
          <h2 className="text-xl font-semibold text-white">{t('about.technologies')}</h2>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {technologies.map((technology) => (
            <span key={technology} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {technology}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="panel p-6">
          <Cpu className="text-cyber-blue" size={28} />
          <h3 className="mt-4 text-xl font-semibold text-white">{t('about.modelPath')}</h3>
          <p className="mt-3 leading-7 text-slate-400">
            {t('about.modelPathText')}
          </p>
        </div>
        <div className="panel p-6">
          <Database className="text-cyber-green" size={28} />
          <h3 className="mt-4 text-xl font-semibold text-white">{t('about.database')}</h3>
          <p className="mt-3 leading-7 text-slate-400">
            {t('about.databaseText')}
          </p>
        </div>
      </section>
    </div>
  )
}
