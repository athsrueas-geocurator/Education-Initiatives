import type { ContinuumPosition, EvidenceStrength } from "@/lib/content-schema";
import { EvidenceContinuum } from "../evidence/EvidenceContinuum";

type Props = {
  eyebrow: string;
  title: string;
  dek: string;
  continuum?: ContinuumPosition;
  evidenceStrength?: EvidenceStrength;
};

export function DossierHero({ eyebrow, title, dek, continuum, evidenceStrength }: Props) {
  return (
    <section className="border-b border-rule bg-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay">{eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.02] text-ink sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{dek}</p>
        </div>
        {continuum && evidenceStrength ? (
          <div className="self-center rounded-lg border border-rule bg-white/70 p-5 shadow-dossier">
            <EvidenceContinuum continuum={continuum} evidenceStrength={evidenceStrength} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
