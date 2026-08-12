import { redirect } from "next/navigation";
import { getDichotomies } from "@/lib/content-loaders";

export function generateStaticParams() {
  return getDichotomies().map((dichotomy) => ({ slug: dichotomy.slug }));
}

export default function ContinuumDetailPage() {
  redirect("/initiatives");
}
