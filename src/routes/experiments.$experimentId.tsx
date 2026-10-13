import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Code2, Copy, Check, BookOpen } from "lucide-react";
import { PortalShell } from "@/components/portal-shell";
import { Button } from "@/components/ui/button";
import { CodeSandbox } from "@/components/CodeSandbox";
import { experiments, pageHead } from "@/lib/learning-data";
export const Route = createFileRoute("/experiments/$experimentId")({
  head: ({ params }) =>
    pageHead(
      experiments.find((e) => e.id === params.experimentId)?.title ?? "Experiment",
      "Explore the aims, practical workflow, and Python code for this data science experiment.",
    ),
  component: ExperimentPage,
});
const stages = [
  "Data Collection",
  "Data Cleaning",
  "Exploratory Data Analysis",
  "Data Visualization",
  "Model Building",
  "Result Analysis",
];
function ExperimentPage() {
  const { experimentId } = Route.useParams();
  const experiment = experiments.find((e) => e.id === experimentId);
  const [stage, setStage] = useState(0);
  const [copied, setCopied] = useState(false);
  const stageName = stages[stage] ?? "Data Collection";
  if (!experiment)
    return (
      <PortalShell>
        <div className="py-14">
          <h1 className="font-display text-3xl">Experiment not found</h1>
          <Link to="/experiments" className="mt-5 block text-primary">
            Back to experiments
          </Link>
        </div>
      </PortalShell>
    );
  const code =
    stage === 0
      ? 'import pandas as pd\n\n# Load the sample dataset\ndf = pd.DataFrame({\n    "student": ["A", "B", "C"],\n    "score": [82, 91, 76]\n})\n\nprint(df.head())'
      : stage === 1
        ? 'import pandas as pd\n\ndf = pd.DataFrame({"score": [82, None, 76, 82]})\ndf = df.drop_duplicates()\ndf["score"] = df["score"].fillna(df["score"].mean())\nprint(df)'
        : stage === 2
          ? 'import pandas as pd\n\ndf = pd.DataFrame({"score": [82, 91, 76]})\nprint(df.describe())'
          : stage === 3
            ? 'import matplotlib.pyplot as plt\n\nplt.bar(["A", "B", "C"], [82, 91, 76])\nplt.xlabel("Student")\nplt.ylabel("Score")\nplt.show()'
            : stage === 4
              ? "from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nmodel.fit([[1], [2], [3]], [2, 4, 6])\nprint(model.predict([[4]]))"
              : "from sklearn.metrics import mean_absolute_error\n\nactual = [82, 91, 76]\npredicted = [80, 90, 78]\nprint(mean_absolute_error(actual, predicted))";
  return (
    <PortalShell>
      <div className="page-enter py-8">
        <Link
          to="/experiments"
          className="mb-6 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <ArrowLeft size={14} />
          All experiments
        </Link>
        <p className="text-[10px] font-semibold tracking-[1.4px] text-primary">
          EXPERIMENT {experiment.number} · {experiment.difficulty.toUpperCase()}
        </p>
        <h1 className="mt-3 font-display text-3xl font-medium">{experiment.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {experiment.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <BookOpen size={14} className="text-primary" />
          <span className="mr-3 text-xs text-muted-foreground">{experiment.module.name}</span>
          {experiment.tools.map((t) => (
            <span className="tool-tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <section className="mt-9 border-y border-border py-6">
          <h2 className="mb-4 font-display text-lg">Experiment workflow</h2>
          <div className="flex flex-wrap items-center gap-2">
            {stages.map((s, i) => (
              <div className="flex items-center gap-2" key={s}>
                <Button
                  variant={stage === i ? "default" : "outline"}
                  className="h-auto whitespace-normal py-2 text-[10px]"
                  onClick={() => setStage(i)}
                >
                  {String.fromCharCode(65 + i)} · {s}
                </Button>
                {i < 5 && <ArrowRight size={12} className="text-muted-foreground" />}
              </div>
            ))}
          </div>
        </section>
        <div className="mt-8">
          <p className="text-xs text-primary">SUB-EXPERIMENT {String.fromCharCode(65 + stage)}</p>
          <h2 className="mb-5 mt-2 font-display text-2xl">{stageName}</h2>
          <h3 className="mb-2 text-sm font-semibold">Aim</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Practice {stageName.toLowerCase()} and understand how this stage contributes to a
            complete data science workflow.
          </p>
          <h3 className="mb-2 mt-6 text-sm font-semibold">Procedure</h3>
          <ol className="list-inside list-decimal space-y-2 text-xs text-muted-foreground">
            <li>Open a Python notebook in Jupyter or Google Colab.</li>
            <li>Import the required libraries and prepare the sample data.</li>
            <li>Run the example below and inspect the result.</li>
            <li>Change the input values and compare your observations.</li>
          </ol>
          <div className="glass-surface mt-7 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Code2 size={14} />
                Python · Sample code
              </span>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Copy code"
                onClick={async () => {
                  await navigator.clipboard.writeText(code);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
            <pre className="overflow-x-auto p-5 text-xs leading-7 text-primary">
              <code>{code}</code>
            </pre>
          </div>
          <CodeSandbox key={stage} initialCode={code} />
          <h3 className="mb-2 mt-6 text-sm font-semibold">Expected output</h3>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs leading-6 text-muted-foreground">
            {stage === 0
              ? "  student  score\n0       A     82\n1       B     91\n2       C     76"
              : stage === 4
                ? "[8.]"
                : stage === 5
                  ? "1.6666666666666667"
                  : stage === 3
                    ? "A bar chart with student scores: A = 82, B = 91, C = 76."
                    : "Inspect the transformed dataset or summary in your notebook."}
          </pre>
        </div>
      </div>
    </PortalShell>
  );
}
