import { DossierHero } from "@/components/dossier/DossierHero";

export default function AboutPage() {
  return (
    <main>
      <DossierHero
        eyebrow="Editorial note"
        title="A synthesis map, not a policy prescription engine"
        dek="The dossier is built from a workbook of initiatives, source links, input variables, output variables, and dichotomy text. It makes evidence legible without pretending evidence eliminates judgment."
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 text-base leading-8 text-muted">
          <p>
            The continuum dot is an editorial synthesis indicator. It summarizes where the current evidence seems to
            point after considering causal strength, implementation risk, outcome choice, and caveats. It is not a
            meta-analytic coefficient.
          </p>
          <p>
            Every major visible claim should either link to a source, synthesize linked sources, or be clearly framed as
            interpretation. The site intentionally keeps null, mixed, and negative findings in view because education
            reforms are often bundles rather than single treatments.
          </p>
          <p>
            The guiding question is not which slogan won. It is which mechanism moved which outcome, for which students,
            under which conditions, with which tradeoffs.
          </p>
        </div>
      </section>
    </main>
  );
}
