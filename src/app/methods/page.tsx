import { DossierHero } from "@/components/dossier/DossierHero";
import { MethodBadge } from "@/components/evidence/MethodBadge";
import { getMethods } from "@/lib/content-loaders";

const featured = [
  "RCT",
  "Lottery",
  "Regression discontinuity",
  "Difference-in-differences",
  "Event study",
  "Matched comparison",
  "Meta-analysis",
  "NAEP",
  "SEDA",
  "Effect sizes",
  "ITT vs TOT",
  "Cost-effectiveness",
  "Fidelity and implementation risk"
];

export default function MethodsPage() {
  const methods = getMethods();
  const groups = Map.groupBy(methods, (method) => method.section);

  return (
    <main>
      <DossierHero
        eyebrow="Method primer"
        title="Evidence strength is not a vibe"
        dek="A study design is a tool for a question. This page explains the comparison logic and normalization problems behind the dossier."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap gap-2">
          {featured.map((item) => (
            <MethodBadge key={item} method={item} />
          ))}
        </div>
        <div className="grid gap-8">
          {Array.from(groups.entries()).map(([section, items]) => (
            <section key={section} className="border-t border-rule pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">{section}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {items.map((item) => (
                  <article key={`${item.section}-${item.item}`} className="rounded-lg border border-rule bg-white p-5">
                    <h2 className="font-serif text-2xl text-ink">{item.item}</h2>
                    <p className="mt-3 text-sm leading-7 text-muted">{item.definition}</p>
                    {item.urls.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.urls.slice(0, 3).map((url) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-rule px-3 py-1 text-xs font-medium text-evidence hover:border-evidence"
                          >
                            Source
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
