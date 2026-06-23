import Link from "next/link";
import { ArrowRight, Library, Scale, Search } from "lucide-react";
import { EvidenceContinuum } from "@/components/evidence/EvidenceContinuum";
import { MethodBadge } from "@/components/evidence/MethodBadge";
import { ShockCard } from "@/components/dossier/ShockCard";
import { getDichotomies, getLandingCards } from "@/lib/content-loaders";

export default function Home() {
  const dichotomies = getDichotomies();
  const landingCards = getLandingCards();
  const featured = dichotomies.slice(0, 6);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-rule bg-paper">
        <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#1f6f68,#245f8f,#b7791f,#9f4f38)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">The guided tour</p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1] text-ink sm:text-7xl">
              The Education Evidence Dossier
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-muted">
              Most school reform debates are argued as absolutes. The evidence usually points to mechanisms,
              not slogans.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/continuums"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper hover:bg-evidence"
              >
                Explore the continuums <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sources"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-5 py-3 text-sm font-semibold text-ink hover:border-evidence"
              >
                See the strongest studies <Library className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="self-end rounded-lg border border-rule bg-white p-5 shadow-dossier">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Featured continuum</p>
            <h2 className="mt-3 font-serif text-2xl text-ink">{featured[1]?.title}</h2>
            {featured[1] ? (
              <div className="mt-5">
                <EvidenceContinuum
                  continuum={featured[1].continuum}
                  evidenceStrength={featured[1].evidenceStrength}
                  size="compact"
                  showLegend={false}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">Shock dossier cards</p>
            <h2 className="mt-3 font-serif text-4xl text-ink">Sourced contradictions worth sitting with</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {landingCards.map((card) => (
            <ShockCard
              key={card.claim}
              claim={card.claim}
              caveat={card.caveat}
              href={`/continuums/${card.dichotomySlug}`}
              evidenceStrength={card.evidenceStrength}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-rule bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">Continuum wall</p>
              <h2 className="mt-3 font-serif text-4xl text-ink">Six debates, no false finish line</h2>
            </div>
            <Link href="/continuums" className="inline-flex items-center gap-2 font-semibold text-evidence">
              Open all scales <Scale className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {featured.map((dichotomy) => (
              <Link
                key={dichotomy.slug}
                href={`/continuums/${dichotomy.slug}`}
                className="rounded-lg border border-rule bg-paper p-5 transition hover:border-evidence"
              >
                <h3 className="font-serif text-2xl text-ink">{dichotomy.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{dichotomy.whatEvidenceSuggests}</p>
                <div className="mt-5">
                  <EvidenceContinuum
                    continuum={dichotomy.continuum}
                    evidenceStrength={dichotomy.evidenceStrength}
                    size="compact"
                    showLegend={false}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1fr] lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">What counts as evidence</p>
          <h2 className="mt-3 font-serif text-4xl text-ink">The methods are part of the story</h2>
          <p className="mt-4 leading-8 text-muted">
            The site weights designs differently because a lottery, a trend line, and a state implementation
            memo answer different questions.
          </p>
          <Link href="/methods" className="mt-6 inline-flex items-center gap-2 font-semibold text-evidence">
            Read the method primer <Search className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid content-start gap-3 sm:grid-cols-2">
          {["RCT", "Lottery", "Difference-in-differences", "Meta-analysis", "NAEP", "Cost-effectiveness"].map(
            (method) => (
              <div key={method} className="rounded-lg border border-rule bg-white p-4">
                <MethodBadge method={method} />
                <p className="mt-3 text-sm leading-6 text-muted">
                  A useful lens only when the outcome, comparison group, dosage, and implementation are visible.
                </p>
              </div>
            )
          )}
        </div>
      </section>

      <section className="border-t border-rule bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="max-w-4xl font-serif text-3xl leading-tight sm:text-5xl">
            Stop asking which slogan won. Ask which mechanism moved which outcome for which students.
          </p>
        </div>
      </section>
    </main>
  );
}
