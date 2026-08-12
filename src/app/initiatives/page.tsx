import { EvidenceDashboard } from "@/components/dashboard/EvidenceDashboard";
import { getInitiatives, getSources } from "@/lib/content-loaders";

export default function InitiativesPage() {
  return <EvidenceDashboard initiatives={getInitiatives()} sources={getSources()} />;
}
