import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from '@/components/portal-shell';
import { LearningCatalog } from '@/components/learning-catalog';
import { pageHead } from '@/lib/learning-data';
export const Route = createFileRoute("/")({
  head: () => pageHead('Learning Portal', 'Explore data science experiments, learning modules, and tools at Mohan Babu University.'),
  component: Index,
});
function Index() {
  return <PortalShell><LearningCatalog /></PortalShell>;
}
