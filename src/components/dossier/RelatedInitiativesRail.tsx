import type { Initiative } from "@/lib/content-schema";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  initiatives: Initiative[];
};

export function RelatedInitiativesRail({ initiatives }: Props) {
  if (!initiatives.length) return null;
  return (
    <section>
      <h2 className="font-serif text-2xl text-ink">Related initiatives</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {initiatives.map((initiative) => (
          <Link
            key={initiative.slug}
            href={`/initiatives/${initiative.slug}`}
            className="group rounded-lg border border-rule bg-white p-4 transition hover:border-evidence"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{initiative.category}</p>
                <h3 className="mt-2 font-semibold text-ink">{initiative.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{initiative.oneLineFinding}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-evidence" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
