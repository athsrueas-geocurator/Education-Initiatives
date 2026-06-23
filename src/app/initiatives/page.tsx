import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DossierHero } from "@/components/dossier/DossierHero";
import { EvidenceStrengthBadge } from "@/components/evidence/EvidenceStrengthBadge";
import { MethodBadge } from "@/components/evidence/MethodBadge";
import { getInitiatives } from "@/lib/content-loaders";

export default function InitiativesPage() {
  const initiatives = getInitiatives();

  return (
    <main>
      <DossierHero
        eyebrow="Evidence layer"
        title="Famous reforms, decoded"
        dek="Initiatives are treated as bundles of mechanisms: inputs changed, populations served, outputs measured, and designs used to evaluate them."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {initiatives.map((initiative) => (
            <Link
              key={initiative.slug}
              href={`/initiatives/${initiative.slug}`}
              className="group rounded-lg border border-rule bg-white p-5 shadow-sm transition hover:border-evidence hover:shadow-dossier"
            >
              <div className="flex items-start justify-between gap-4">
                <EvidenceStrengthBadge strength={initiative.evidenceStrength} compact />
                <ArrowRight className="h-5 w-5 text-muted transition group-hover:translate-x-1 group-hover:text-evidence" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-clay">{initiative.category}</p>
              <h2 className="mt-2 font-serif text-2xl leading-tight text-ink">{initiative.name}</h2>
              <p className="mt-3 text-sm text-muted">{initiative.years}</p>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink">{initiative.oneLineFinding}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {initiative.methodTags.slice(0, 3).map((method) => (
                  <MethodBadge key={method} method={method} muted />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
