import datasetCatalog from "@/../research-data/dataset-catalog.json";

export default function AboutPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">Data collections</p>
          <h1 className="mt-3 text-4xl font-semibold">National comparison data</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">The local research intake includes these source collections. Use the source links and documentation before making a new comparison.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {datasetCatalog.map((dataset) => (
            <article key={dataset.id} className="border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4"><h2 className="text-lg font-semibold text-slate-950">{dataset.title}</h2><span className="shrink-0 border border-slate-200 px-2 py-1 font-mono text-[10px] uppercase text-slate-500">{dataset.collectionStatus}</span></div>
              <p className="mt-2 text-sm text-slate-500">{dataset.steward}</p>
              <p className="mt-4 text-sm leading-6 text-slate-700">{dataset.notes}</p>
              <a href={dataset.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-medium text-sky-700 hover:text-slate-950">Open source</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
