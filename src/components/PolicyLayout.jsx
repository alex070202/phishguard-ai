import PageMeta from './PageMeta.jsx'

export default function PolicyLayout({ title, description, children }) {
  return (
    <article className="mx-auto max-w-4xl">
      <PageMeta title={title} description={description} />
      <div className="panel p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyber-cyan">PhishGuard AI</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        <p className="mt-4 leading-7 text-slate-400">{description}</p>
        <div className="mt-8 space-y-7 text-slate-300">{children}</div>
      </div>
    </article>
  )
}
