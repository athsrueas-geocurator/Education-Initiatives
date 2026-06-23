import type { ResearchDesign } from "@/lib/content-schema";
import clsx from "clsx";

type Props = {
  method: ResearchDesign | string;
  muted?: boolean;
};

export function MethodBadge({ method, muted = false }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
        muted ? "border-rule bg-paper text-muted" : "border-ink/15 bg-white text-ink"
      )}
    >
      {method}
    </span>
  );
}
