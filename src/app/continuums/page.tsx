import { DossierHero } from "@/components/dossier/DossierHero";
import { getDichotomies } from "@/lib/content-loaders";
import { ContinuumsExplorer } from "./ContinuumsExplorer";

export default function ContinuumsPage() {
  const dichotomies = getDichotomies();

  return (
    <main>
      <DossierHero
        eyebrow="Evidence scales"
        title="The dichotomies are the front door"
        dek="Each scale shows an editorial synthesis dot, a reasonable uncertainty band, and the sources underneath. It is a map of mechanisms, not a declaration that one slogan defeated another."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ContinuumsExplorer dichotomies={dichotomies} />
      </section>
    </main>
  );
}
