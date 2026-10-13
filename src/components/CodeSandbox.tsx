import { useState } from "react";
import { Check, Copy, Play, RotateCcw, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type PyodideRuntime = {
  loadPackage: (packages: string | string[]) => Promise<void>;
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (text: string) => void }) => void;
};

declare global {
  interface Window {
    loadPyodide?: (options?: { indexURL?: string }) => Promise<PyodideRuntime>;
  }
}

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js";
let runtimePromise: Promise<PyodideRuntime> | null = null;

function loadPythonRuntime(): Promise<PyodideRuntime> {
  if (typeof window.loadPyodide === "function") {
    runtimePromise ??= window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
    });
    return runtimePromise;
  }

  runtimePromise = new Promise<PyodideRuntime>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${PYODIDE_URL}"]`);
    const script = existing ?? document.createElement("script");
    const onLoad = () => {
      if (!window.loadPyodide) {
        reject(
          new Error(
            "Python runtime did not initialize. Check your internet connection and try again.",
          ),
        );
        return;
      }
      window
        .loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/" })
        .then(resolve, reject);
    };
    const onError = () =>
      reject(
        new Error("Could not download the Python runtime. Connect to the internet and retry."),
      );
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    if (!existing) {
      script.src = PYODIDE_URL;
      script.async = true;
      document.head.appendChild(script);
    } else if (window.loadPyodide) {
      onLoad();
    }
  }).catch((error) => {
    runtimePromise = null;
    throw error;
  });

  return runtimePromise!;
}

export function CodeSandbox({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("Your program output will appear here.");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const runCode = async () => {
    setBusy(true);
    setOutput("Starting Python runtime… the first run may take a little longer.");
    try {
      const pyodide = await loadPythonRuntime();
      const packages: string[] = [];
      if (/\b(pandas|pd)\b/.test(code) || /import pandas/.test(code)) packages.push("pandas");
      if (/\b(numpy|np)\b/.test(code) || /import numpy/.test(code)) packages.push("numpy");
      if (/matplotlib/.test(code)) packages.push("matplotlib");
      if (/sklearn/.test(code)) packages.push("scikit-learn");
      if (packages.length) {
        setOutput(`Installing required Python packages: ${packages.join(", ")}…`);
        await pyodide.loadPackage([...new Set(packages)]);
      }

      const outputLines: string[] = [];
      pyodide.setStdout({ batched: (text) => outputLines.push(text) });
      await pyodide.runPythonAsync(code);
      setOutput(
        outputLines.join("\\n").trim() ||
          "Code executed successfully. No console output was produced.",
      );
    } catch (error) {
      setOutput(`Execution error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setBusy(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setOutput(
        "Clipboard access was blocked by the browser. Select the code and copy it manually.",
      );
    }
  };

  return (
    <section className="glass-surface mt-8 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">Interactive Python Sandbox</h3>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Runs Python in your browser using Pyodide. Internet is needed for the first load and
            packages.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={copyCode}>
            <Copy size={14} />
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCode(initialCode);
              setOutput("Code reset. Click Run to execute it.");
            }}
          >
            <RotateCcw size={14} />
            Reset
          </Button>
          <Button size="sm" onClick={runCode} disabled={busy}>
            {busy ? <LoaderCircle size={14} className="animate-spin" /> : <Play size={14} />}
            {busy ? "Running…" : "Run Python"}
          </Button>
        </div>
      </div>
      <label className="sr-only" htmlFor="python-code-editor">
        Python code editor
      </label>
      <textarea
        id="python-code-editor"
        spellCheck={false}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        className="min-h-[260px] w-full resize-y bg-[#10151d] p-5 font-mono text-xs leading-6 text-emerald-100 outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        aria-label="Python code editor"
      />
      <div className="border-t border-border">
        <div className="flex items-center gap-2 px-4 py-3 text-xs font-semibold">
          <Check size={14} className="text-primary" />
          Output Console
        </div>
        <pre
          aria-live="polite"
          className="min-h-20 overflow-x-auto whitespace-pre-wrap break-words bg-black/20 px-4 pb-4 text-xs leading-6 text-muted-foreground"
        >
          {output}
        </pre>
      </div>
    </section>
  );
}
