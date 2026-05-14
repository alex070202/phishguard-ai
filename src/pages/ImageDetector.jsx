import { BrainCircuit, FileImage, Fingerprint, ScanEye, ShieldQuestion, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import ResultCard from '../components/ResultCard.jsx'
import RiskScoreCard from '../components/RiskScoreCard.jsx'
import { saveAnalysisRecord } from '../utils/analysisHistory.js'
import { analyzeImageFile } from '../utils/imageHeuristics.js'

export default function ImageDetector() {
  const [preview, setPreview] = useState('')
  const [fileName, setFileName] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [result, setResult] = useState(null)

  function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  function handleAnalyze() {
    if (!selectedFile) return

    const nextResult = analyzeImageFile(selectedFile)
    setResult(nextResult)
    saveAnalysisRecord({
      type: 'Image',
      target: selectedFile.name,
      score: nextResult.probability,
      status: nextResult.status,
    })
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
            onClick={handleAnalyze}
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

        {result && (
          <>
            <RiskScoreCard
              score={result.probability}
              label={result.status}
              tone={result.tone}
              title="AI probability"
              caption={result.summary}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <ResultCard icon={BrainCircuit} title="Texture patterns" tone="amber">
                This frontend version cannot inspect pixels deeply yet. A real model can be connected here later.
              </ResultCard>
              <ResultCard icon={Fingerprint} title="Metadata signals" tone="blue">
                {result.explanations[0]}
              </ResultCard>
              <ResultCard icon={ScanEye} title="Visual consistency" tone="cyan">
                {result.explanations.slice(1).join(' ') || 'No additional file-level signals were found.'}
              </ResultCard>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
