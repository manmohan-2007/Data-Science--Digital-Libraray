import { createFileRoute } from '@tanstack/react-router';
import { PortalShell } from '@/components/portal-shell';
import { LearningCatalog } from '@/components/learning-catalog';
import { pageHead } from '@/lib/learning-data';
export const Route = createFileRoute('/tools')({ head: () => pageHead('Tools & Libraries', 'Explore the essential programming, analysis, visualization, and machine learning tools.'), component: () => <PortalShell><LearningCatalog mode="tools" /></PortalShell> });