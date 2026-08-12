import { EvidenceTour } from "@/components/tour/EvidenceTour";
import { getInitiatives, getSources } from "@/lib/content-loaders";

export default function TourPage() {
  return <EvidenceTour initiatives={getInitiatives()} sources={getSources()} />;
}
