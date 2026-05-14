import { BrainCircuit, FileImage, Fingerprint, ScanEye, ShieldQuestion, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import ResultCard from '../components/ResultCard.jsx'
import RiskScoreCard from '../components/RiskScoreCard.jsx'

export default function ImageDetector() {
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('')
  const [showResult, setShowResult] = useState(false)

  function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setPreview(URL.createObjectURL(file))
    setShowResult(false)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-green">Visual AI module</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">AI Image Detector</h1>
        <p className="mt-4 leading-7 text-slate-400">
          Upload an image to preview it and simulate an AI-generated probability report.
        </p>

        <div className="panel mt-7 p-6">
          <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyber-cyan/35 bg-cyber-cyan/5 p-6 text-center transition hover:border-cyber-cyan/70 hover:bg-cyber-cyan/10">
            <UploadCloud className="text-cyber-cyan" size={42} />
            <span className="mt-4 text-lg font-semibold text-white">Upload image</span>
            <span className="mt-2 text-sm text-slate-400">PNG, JPG or WEBP file</span>
            <input className="sr-only" type="file" accept="image/*" onChange={handleFile} />
          </label>

          {fileName && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <FileImage className="text-cyber-green" size={18} />
              {fileName}
            </div>
          )}

          <button
            type="button"
            className="primary-button mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!preview}
            onClick={() => setShowResult(true)}
          >
            <ScanEye size={18} />
            Detect AI Image
          </button>
        </div>
      </section>

      <section className="space-y-5">
        <div className="panel overflow-hidden">
          {preview ? (
            <img src={preview} alt="Uploaded preview" className="h-80 w-full object-cover" />
          ) : (
            <div className="flex h-80 items-center justify-center p-8 text-center">
              <div>
                <ShieldQuestion className="mx-auto text-cyber-cyan" size={44} />
                <p className="mt-4 text-lg font-semibold text-white">Image preview</p>
                <p className="mt-2 text-sm text-slate-400">The uploaded image will appear here.</p>
              </div>
            </div>
          )}
        </div>

        {showResult && (
          <>
            <RiskScoreCard
              score={74}
              label="Suspicious"
              tone="amber"
              caption="AI generated probability: 74%. Status: Suspicious / Possibly AI-generated."
            />
            <div className="grid gap-4 md:grid-cols-3">
              <ResultCard icon={BrainCircuit} title="Texture patterns" tone="amber">
                Fine details show synthetic-like repetition and inconsistent local texture.
              </ResultCard>
              <ResultCard icon={Fingerprint} title="Metadata signals" tone="blue">
                Metadata is incomplete, which can happen after editing or generated export workflows.
              </ResultCard>
              <ResultCard icon={ScanEye} title="Visual consistency" tone="cyan">
                Lighting and object boundaries include mild inconsistencies in the mock inspection.
              </ResultCard>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
