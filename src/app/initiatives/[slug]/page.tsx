import Link from "next/link";
import { notFound } from "next/navigation";
import { DossierHero } from "@/components/dossier/DossierHero";
import { SourceDrawer } from "@/components/evidence/SourceDrawer";
import { EvidenceStrengthBadge } from "@/components/evidence/EvidenceStrengthBadge";
import { MethodBadge } from "@/components/evidence/MethodBadge";
import {
  getInitiative,
  getInitiatives,
  getRelatedDichotomies,
  getSourcesByIds
} from "@/lib/content-loaders";
import { rankSources } from "@/lib/source-ranking";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getInitiatives().map((initiative) => ({ slug: initiative.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const initiative = getInitiative(slug);
  return {
    title: initiative ? `${initiative.name} | Education Evidence Dossier` : "Initiative"
  };
}

export default async function InitiativeDetailPage({ params }: Props) {
  const { slug } = await params;
  const initiative = getInitiative(slug);
  if (!initiative) notFound();

  const sources = rankSources(getSourcesByIds(initiative.sourceIds));
  const relatedDichotomies = getRelatedDichotomies(initiative);

  const facts = [
    ["Years / scale", initiative.years],
    ["Category", initiative.category],
    ["Target population", initiative.targetPopulation],
    ["Inputs changed", initiative.inputVariablesChanged],
    ["Outputs measured", initiative.outputsMeasured],
    ["Evaluation designs", initiative.evaluationDesigns],
    ["Normalization problems", initiative.normalizationIssues]
  ];

  return (
    <main>
      <DossierHero eyebrow={initiative.category} title={initiative.name} dek={initiative.oneLineFinding} />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          <section className="rounded-lg border border-rule bg-white p-6">
            <div className="flex flex-wrap gap-2">
              <EvidenceStrengthBadge strength={initiative.evidenceStrength} />
              {initiative.methodTags.map((method) => (
                <MethodBadge key={method} method={method} />
              ))}
            </div>
            <h2 className="mt-6 font-serif text-3xl text-ink">Theory of action</h2>
            <p className="mt-4 text-base leading-8 text-muted">{initiative.theoryOfAction}</p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {facts.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-rule bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{label}</p>
                <p className="mt-3 text-sm leading-6 text-ink">{value || "Not specified in workbook."}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="font-serif text-2xl text-ink">Related dichotomies</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {relatedDichotomies.map((dichotomy) => (
                <Link
                  key={dichotomy.slug}
                  href={`/continuums/${dichotomy.slug}`}
                  className="rounded-lg border border-rule bg-white p-4 font-semibold text-ink hover:border-evidence"
                >
                  {dichotomy.title}
                </Link>
              ))}
            </div>
          </section>

          <SourceDrawer sources={sources} title="Source cards" />
        </div>
      </section>
    </main>
  );
}
