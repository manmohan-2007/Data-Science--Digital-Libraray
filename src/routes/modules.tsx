import { createFileRoute } from '@tanstack/react-router';
import { PortalShell } from '@/components/portal-shell';
import { LearningCatalog } from '@/components/learning-catalog';
import { pageHead } from '@/lib/learning-data';
export const Route = createFileRoute('/modules')({ head: () => pageHead('Learning Modules', 'Explore five core data science modules at Mohan Babu University.'), component: () => <PortalShell><LearningCatalog mode="modules" /></PortalShell> });