import { createFileRoute } from '@tanstack/react-router';
import { PortalShell } from '@/components/portal-shell';
import { LearningCatalog } from '@/components/learning-catalog';
import { pageHead } from '@/lib/learning-data';
export const Route = createFileRoute('/experiments/')({ head: () => pageHead('Experiments', 'Discover fifteen practical data science experiments, from Python to machine learning.'), component: () => <PortalShell><LearningCatalog mode="experiments" /></PortalShell> });