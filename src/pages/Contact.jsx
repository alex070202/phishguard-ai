import { Github, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageMeta from '../components/PageMeta.jsx'
import { translateError } from '../i18n/display.js'
import { sendContactMessage } from '../services/api.js'

export default function Contact() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    if (!formData.name.trim() || !formData.email.includes('@') || formData.message.trim().length < 10) {
      setStatus({ type: 'error', message: t('contact.validation') })
      return
    }

    setIsLoading(true)
    try {
      await sendContactMessage(formData)
      setStatus({ type: 'success', message: t('contact.success') })
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setStatus({ type: 'error', message: translateError(t, error.message) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <PageMeta title={t('contact.title')} description={t('contact.meta')} />
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">{t('contact.eyebrow')}</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{t('contact.heading')}</h1>
        <p className="mt-4 leading-7 text-slate-400">
          {t('contact.description')}
        </p>
        <div className="mt-6 grid gap-4">
          <div className="soft-panel p-5">
            <Mail className="text-cyber-cyan" size={24} />
            <h2 className="mt-3 font-semibold text-white">{t('common.email')}</h2>
            <p className="mt-2 text-sm text-slate-400">{t('contact.emailText')}</p>
          </div>
          <div className="soft-panel p-5">
            <Github className="text-cyber-green" size={24} />
            <h2 className="mt-3 font-semibold text-white">GitHub</h2>
            <p className="mt-2 text-sm text-slate-400">{t('contact.githubText')}</p>
          </div>
        </div>
      </section>

      <form className="panel space-y-5 p-6" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">{t('common.name')}</span>
          <input className="input-field" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">{t('common.email')}</span>
          <input className="input-field" type="email" value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">{t('common.message')}</span>
          <textarea className="input-field min-h-40 resize-y" value={formData.message} onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))} required />
        </label>
        {status.message && (
          <div className={`rounded-lg border p-3 text-sm ${status.type === 'success' ? 'border-cyber-green/25 bg-cyber-green/10 text-cyber-green' : 'border-cyber-red/25 bg-cyber-red/10 text-cyber-red'}`}>
            {status.message}
          </div>
        )}
        <button className="primary-button w-full disabled:opacity-60" disabled={isLoading} type="submit">
          <Send size={18} />
          {isLoading ? t('contact.sending') : t('contact.send')}
        </button>
      </form>
    </div>
  )
}
