import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal-shell";
import PdfUpload from "@/components/PdfUpload";
import { pageHead } from "@/lib/learning-data";

export const Route = createFileRoute("/materials")({
  head: () =>
    pageHead("My PDF Library", "Upload, preview, download, and manage your persistent study PDFs."),
  component: MaterialsPage,
});

function MaterialsPage() {
  return (
    <PortalShell>
      <div className="page-enter py-8">
        <p className="mb-2 text-[10px] font-semibold tracking-[1.5px] text-primary">
          STUDY WORKSPACE
        </p>
        <PdfUpload />
      </div>
    </PortalShell>
  );
}
