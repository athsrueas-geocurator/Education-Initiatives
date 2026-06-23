import type { Source } from "@/lib/content-schema";
import { ChevronDown } from "lucide-react";
import { SourceCard } from "./SourceCard";

type Props = {
  sources: Source[];
  title?: string;
};

export function SourceDrawer({ sources, title = "Sources" }: Props) {
  return (
    <details className="group rounded-lg border border-rule bg-white/80 p-4 shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
        <span>
          {title} <span className="text-muted">({sources.length})</span>
        </span>
        <ChevronDown className="h-5 w-5 transition group-open:rotate-180" />
      </summary>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
    </details>
  );
}
