import { DossierHero } from "@/components/dossier/DossierHero";
import { getSources } from "@/lib/content-loaders";
import { rankSources } from "@/lib/source-ranking";
import { SourcesLibrary } from "./SourcesLibrary";

export default function SourcesPage() {
  const sources = rankSources(getSources());

  return (
    <main>
      <DossierHero
        eyebrow="Research library"
        title="Sources beneath the synthesis"
        dek="Search the workbook-derived source library by title, institution, finding, caveat, or method. Source cards keep direct links visible because credibility depends on traceability."
      />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SourcesLibrary sources={sources} />
      </section>
    </main>
  );
}
