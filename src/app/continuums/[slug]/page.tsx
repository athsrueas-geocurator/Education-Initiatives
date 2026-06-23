import { notFound } from "next/navigation";
import { DossierHero } from "@/components/dossier/DossierHero";
import { ClaimBlock } from "@/components/dossier/ClaimBlock";
import { CaveatPanel } from "@/components/dossier/CaveatPanel";
import { RelatedInitiativesRail } from "@/components/dossier/RelatedInitiativesRail";
import { WhatWouldChangeOurMind } from "@/components/dossier/WhatWouldChangeOurMind";
import { EvidenceContinuum } from "@/components/evidence/EvidenceContinuum";
import { SourceDrawer } from "@/components/evidence/SourceDrawer";
import {
  getDichotomy,
  getDichotomies,
  getDichotomyInitiatives,
  getSourcesByIds
} from "@/lib/content-loaders";
import { rankSources } from "@/lib/source-ranking";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getDichotomies().map((dichotomy) => ({ slug: dichotomy.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const dichotomy = getDichotomy(slug);
  return {
    title: dichotomy ? `${dichotomy.title} | Education Evidence Dossier` : "Dichotomy"
  };
}

export default async function ContinuumDetailPage({ params }: Props) {
  const { slug } = await params;
  const dichotomy = getDichotomy(slug);
  if (!dichotomy) notFound();

  const sources = rankSources(getSourcesByIds(dichotomy.sourceIds));
  const initiatives = getDichotomyInitiatives(dichotomy);

  return (
    <main>
      <DossierHero
        eyebrow={dichotomy.topic}
        title={dichotomy.title}
        dek={dichotomy.dek}
        continuum={dichotomy.continuum}
        evidenceStrength={dichotomy.evidenceStrength}
      />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-rule bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Left slogan</p>
              <p className="mt-3 font-serif text-2xl text-ink">{dichotomy.continuum.leftPole}</p>
            </div>
            <div className="rounded-lg border border-rule bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Right slogan</p>
              <p className="mt-3 font-serif text-2xl text-ink">{dichotomy.continuum.rightPole}</p>
            </div>
          </section>

          <ClaimBlock
            label="What the argument is really about"
            title="The philosophical disagreement"
            body={dichotomy.philosophicalDisagreement}
          />

          <section className="border-t border-rule py-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">Where the evidence points</p>
            <h2 className="mt-3 font-serif text-3xl text-ink">A directional synthesis, not a truth dot</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{dichotomy.whatEvidenceSuggests}</p>
            <div className="mt-6 rounded-lg border border-rule bg-white p-5">
              <EvidenceContinuum continuum={dichotomy.continuum} evidenceStrength={dichotomy.evidenceStrength} />
            </div>
          </section>

          <SourceDrawer sources={sources} title="Best research" />

          <ClaimBlock
            label="Why comparison is hard"
            title="Normalization issues"
            body="Education evidence often changes meaning when the outcome changes. Test scores, NAEP trends, course completion, graduation, adult wages, implementation fidelity, and treatment-on-treated effects can point in different directions."
          />

          <CaveatPanel items={dichotomy.commonMisreadings} />
          <WhatWouldChangeOurMind body={dichotomy.whatWouldChangeOurMind} />
          <RelatedInitiativesRail initiatives={initiatives} />
        </div>
      </section>
    </main>
  );
}
