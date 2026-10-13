import { useCallback, useEffect, useState } from "react";
import { Upload, FileText, Eye, Download, Trash2 } from "lucide-react";

type StoredPDF = {
  id: string;
  name: string;
  size: number;
  file: Blob;
};

type DisplayPDF = {
  id: string;
  name: string;
  size: number;
  url: string;
};

const DB_NAME = "mbu-pdf-library";
const STORE_NAME = "pdfs";

function openPDFDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePDF(pdf: StoredPDF): Promise<void> {
  const db = await openPDFDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).put(pdf);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      const error = transaction.error;
      db.close();
      reject(error);
    };

    transaction.onabort = () => {
      const error = transaction.error;
      db.close();
      reject(error);
    };
  });
}

async function getAllPDFs(): Promise<StoredPDF[]> {
  const db = await openPDFDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => {
      resolve(request.result as StoredPDF[]);
    };

    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

async function deletePDF(id: string): Promise<void> {
  const db = await openPDFDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");

    transaction.objectStore(STORE_NAME).delete(id);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      const error = transaction.error;
      db.close();
      reject(error);
    };

    transaction.onabort = () => {
      const error = transaction.error;
      db.close();
      reject(error);
    };
  });
}

export default function PdfUpload() {
  const [pdfs, setPdfs] = useState<DisplayPDF[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const refreshPDFs = useCallback(async () => {
    const savedFiles = await getAllPDFs();

    const displayedFiles = savedFiles.map((pdf) => ({
      id: pdf.id,
      name: pdf.name,
      size: pdf.size,
      url: URL.createObjectURL(pdf.file),
    }));

    setPdfs(displayedFiles);
  }, []);

  // Restore saved PDFs whenever the page opens or refreshes.
  useEffect(() => {
    let active = true;

    // Ask the browser to protect this origin's IndexedDB data from automatic eviction.
    // The user still controls explicit deletion from the PDF Library.
    if (typeof navigator !== "undefined" && navigator.storage?.persist) {
      void navigator.storage.persist().catch(() => false);
    }

    async function loadPDFs() {
      try {
        const savedFiles = await getAllPDFs();

        if (!active) return;

        setPdfs(
          savedFiles.map((pdf) => ({
            id: pdf.id,
            name: pdf.name,
            size: pdf.size,
            url: URL.createObjectURL(pdf.file),
          })),
        );
      } catch {
        if (active) {
          setError("Unable to load saved PDFs. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPDFs();

    return () => {
      active = false;
    };
  }, []);

  // Release temporary preview URLs when the list changes or unmounts.
  useEffect(() => {
    return () => {
      pdfs.forEach((pdf) => URL.revokeObjectURL(pdf.url));
    };
  }, [pdfs]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const files = Array.from(input.files || []);

    setError("");

    if (files.length === 0) return;

    const invalidFile = files.find(
      (file) => file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"),
    );

    if (invalidFile) {
      setError("Please select PDF files only.");
      input.value = "";
      return;
    }

    setBusy(true);

    try {
      for (const file of files) {
        const savedPDF: StoredPDF = {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          file,
        };

        // Save the actual PDF file in IndexedDB.
        await savePDF(savedPDF);
      }

      await refreshPDFs();
    } catch {
      setError("Could not save the PDF. Browser storage may be full.");
    } finally {
      setBusy(false);
      input.value = "";
    }
  };

  const handleRemove = async (pdf: DisplayPDF) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently remove "${pdf.name}" from this portal?`,
    );

    if (!confirmed) return;

    setError("");

    try {
      // Delete only when the user confirms.
      await deletePDF(pdf.id);
      await refreshPDFs();
    } catch {
      setError("Unable to remove this PDF. Please try again.");
    }
  };

  const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My PDF Library</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Upload and keep your personal study materials in your portal.
        </p>
      </div>

      <label
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-10 text-center transition hover:border-primary hover:bg-accent/30 ${
          busy ? "cursor-wait opacity-60" : "cursor-pointer"
        }`}
      >
        <Upload size={32} className="mb-3 text-primary" />

        <span className="font-medium">{busy ? "Saving your PDFs..." : "Choose PDF files"}</span>

        <span className="mt-2 text-sm text-muted-foreground">
          Browse your computer's Downloads or Documents folder
        </span>

        <input
          type="file"
          accept=".pdf,application/pdf"
          multiple
          disabled={busy}
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Saved documents ({pdfs.length})</h2>

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading your saved PDFs...
          </p>
        ) : pdfs.length === 0 ? (
          <div className="rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">
            No saved PDFs yet. Upload your first PDF above.
          </div>
        ) : (
          pdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="shrink-0 text-primary" size={28} />

                <div className="min-w-0">
                  <p className="break-all text-sm font-medium">{pdf.name}</p>

                  <p className="mt-1 text-xs text-muted-foreground">{formatSize(pdf.size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.open(pdf.url, "_blank", "noopener,noreferrer")}
                  title="Open PDF"
                  aria-label={`Open ${pdf.name}`}
                  className="rounded-lg border p-2 hover:bg-accent"
                >
                  <Eye size={17} />
                </button>

                <a
                  href={pdf.url}
                  download={pdf.name}
                  title="Download PDF"
                  aria-label={`Download ${pdf.name}`}
                  className="rounded-lg border p-2 hover:bg-accent"
                >
                  <Download size={17} />
                </a>

                <button
                  type="button"
                  onClick={() => handleRemove(pdf)}
                  title="Remove PDF"
                  aria-label={`Remove ${pdf.name}`}
                  className="rounded-lg border p-2 text-destructive hover:bg-accent"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
