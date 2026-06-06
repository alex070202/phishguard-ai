import { BrainCircuit, FileImage, Fingerprint, ScanEye, ShieldQuestion, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ResultCard from '../components/ResultCard.jsx'
import RecommendationList from '../components/RecommendationList.jsx'
import RiskScoreCard from '../components/RiskScoreCard.jsx'
import { translateError, translateRecommendation, translateStatus } from '../i18n/display.js'
import { analyzeImage } from '../services/api.js'

export default function ImageDetector() {
  const { t } = useTranslation()
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError('')
  }

  async function handleAnalyze() {
    if (!selectedFile) return

    setIsLoading(true)
    setError('')

    try {
      const nextResult = await analyzeImage(selectedFile)
      setResult(nextResult)
    } catch (requestError) {
      setError(translateError(t, requestError.message))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-green">{t('image.eyebrow')}</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{t('image.title')}</h1>
        <p className="mt-4 leading-7 text-slate-400">
          {t('image.description')}
        </p>

        <div className="panel mt-7 p-6">
          <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyber-cyan/35 bg-cyber-cyan/5 p-6 text-center transition hover:border-cyber-cyan/70 hover:bg-cyber-cyan/10">
            <UploadCloud className="text-cyber-cyan" size={42} />
            <span className="mt-4 text-lg font-semibold text-white">{t('image.upload')}</span>
            <span className="mt-2 text-sm text-slate-400">{t('image.formats')}</span>
            <input className="sr-only" type="file" accept="image/*" onChange={handleFile} />
          </label>

          {fileName && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <FileImage className="text-cyber-green" size={18} />
              {fileName}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-cyber-red/25 bg-cyber-red/10 p-4 text-sm text-cyber-red">
              {error}
            </div>
          )}

          <button
            type="button"
            className="primary-button mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!preview || isLoading}
            onClick={handleAnalyze}
          >
            <ScanEye size={18} />
            {isLoading ? t('image.analyzing') : t('image.detect')}
          </button>
        </div>
      </section>

      <section className="space-y-5">
        <div className="panel overflow-hidden">
          {preview ? (
            <img src={preview} alt={t('image.previewAlt')} className="h-80 w-full object-cover" />
          ) : (
            <div className="flex h-80 items-center justify-center p-8 text-center">
              <div>
                <ShieldQuestion className="mx-auto text-cyber-cyan" size={44} />
                <p className="mt-4 text-lg font-semibold text-white">{t('image.preview')}</p>
                <p className="mt-2 text-sm text-slate-400">{t('image.previewText')}</p>
              </div>
            </div>
          )}
        </div>

        {result && (
          <>
            <RiskScoreCard
              score={result.probability}
              label={translateStatus(t, result.status)}
              tone={result.tone}
              title={t('image.probability')}
              caption={t('image.resultSummary', { score: result.probability })}
            />
            <div className="panel p-5">
              <h2 className="text-lg font-semibold text-white">{t('image.modelStatus')}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="soft-panel p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{t('image.model')}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{result.modelName || t('image.notConfigured')}</p>
                </div>
                <div className="soft-panel p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{t('image.confidence')}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{Math.round((result.confidence || 0) * 100)}%</p>
                </div>
                <div className="soft-panel p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{t('image.modelAvailable')}</p>
                  <p className={result.modelAvailable ? 'mt-2 text-sm font-semibold text-cyber-green' : 'mt-2 text-sm font-semibold text-cyber-amber'}>
                    {result.modelAvailable ? t('common.yes') : t('common.no')}
                  </p>
                </div>
                <div className="soft-panel p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{t('image.fallbackUsed')}</p>
                  <p className={result.fallbackUsed ? 'mt-2 text-sm font-semibold text-cyber-amber' : 'mt-2 text-sm font-semibold text-cyber-green'}>
                    {result.fallbackUsed ? t('common.yes') : t('common.no')}
                  </p>
                </div>
              </div>
              {result.fallbackUsed && (
                <p className="mt-4 rounded-lg border border-cyber-amber/25 bg-cyber-amber/10 p-3 text-sm text-cyber-amber">
                  {t('image.fallbackWarning')}
                </p>
              )}
            </div>
            {result.signals && (
              <div className="panel p-5">
                <h2 className="text-lg font-semibold text-white">{t('image.signals')}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Signal label="EXIF" value={result.signals.exifPresent ? t('image.present') : t('image.missing')} />
                  <Signal label={t('image.software')} value={result.signals.softwareTag || t('common.notFound')} />
                  <Signal label={t('image.dimensions')} value={`${result.signals.width} x ${result.signals.height}`} />
                  <Signal label={t('image.format')} value={result.signals.format || t('common.unknown')} />
                  <Signal label={t('image.fileSize')} value={`${result.signals.fileSizeBytes} bytes`} />
                  <Signal label={t('image.compression')} value={(result.signals.compressionIndicators || []).join(', ') || t('common.notAvailable')} />
                </div>
              </div>
            )}
            {result.persistenceWarning && (
              <div className="rounded-xl border border-cyber-amber/25 bg-cyber-amber/10 p-4 text-sm text-cyber-amber">
                {t('phishing.persistenceWarning', { message: result.persistenceWarning })}
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-3">
              <ResultCard icon={BrainCircuit} title={t('image.texture')} tone="amber">
                {t('image.textureDescription')}
              </ResultCard>
              <ResultCard icon={Fingerprint} title={t('image.metadata')} tone="blue">
                {t('image.metadataDescription')}
              </ResultCard>
              <ResultCard icon={ScanEye} title={t('image.consistency')} tone="cyan">
                {t('image.consistencyDescription')}
              </ResultCard>
            </div>

            <RecommendationList items={result.recommendations.map((item) => translateRecommendation(t, item))} tone={result.tone} />
          </>
        )}
      </section>
    </div>
  )
}

function Signal({ label, value }) {
  return (
    <div className="soft-panel p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-white">{value}</p>
    </div>
  )
}
