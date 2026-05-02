"use client";

import { useEffect, useState } from "react";
import { Button } from "@/ui/Button";
import { Dialog } from "@/ui/Dialog";
import { Switch } from "@/ui/Switch";
import { cn } from "@/shared/utils/cn";
import { encodePreset } from "../lib";
import { useWizardStore } from "../stores/useWizardStore";
import type { FrameworkOption } from "../data";

export interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const FRAMEWORKS: Array<{ id: FrameworkOption; label: string; description: string }> = [
  { id: "nextjs", label: "Next.js", description: "App Router, RSC, API routes" },
  { id: "vite", label: "Vite", description: "Fast SPA build and HMR" },
];

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [copied, setCopied] = useState<"cli" | "url" | null>(null);

  const wizardState = useWizardStore();
  const encodedPreset = encodePreset(wizardState.getPresetConfig());
  const cliCommand = `npx react-principles create my-app --preset ${encodedPreset}`;
  const shareUrl = `${typeof window === "undefined" ? "" : window.location.origin}/create?preset=${encodedPreset}`;

  useEffect(() => {
    if (!open) {
      setStep(1);
      setCopied(null);
    }
  }, [open]);

  const copyToClipboard = async (value: string, type: "cli" | "url") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const sharePreset = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "React Principles preset",
        text: "Check out this React starter configuration.",
        url: shareUrl,
      });
      return;
    }

    await copyToClipboard(shareUrl, "url");
  };

  return (
    <Dialog open={open} onClose={onClose} size="lg" className="max-h-[90vh] overflow-hidden">
      <Dialog.Header className="flex flex-row items-start justify-between gap-4">
        <div>
          <Dialog.Title>Create Project</Dialog.Title>
          <Dialog.Description>
            {step === 1 ? "Choose the stack that should be included in the generated starter." : "Copy your CLI command or share this preset."}
          </Dialog.Description>
        </div>
        <span className="mr-8 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 dark:bg-[#0d1117] dark:text-slate-400">
          Step {step} / 2
        </span>
      </Dialog.Header>

      <Dialog.Content className="max-h-[60vh] overflow-y-auto">
        {step === 1 ? (
          <div className="space-y-6">
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Framework</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {FRAMEWORKS.map((framework) => {
                  const selected = wizardState.framework === framework.id;
                  return (
                    <button
                      key={framework.id}
                      type="button"
                      onClick={() => wizardState.setFramework(framework.id)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-colors",
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-[#1f2937] dark:text-slate-300 dark:hover:bg-[#161b22]",
                      )}
                    >
                      <span className="block text-sm font-bold">{framework.label}</span>
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{framework.description}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Stack Features</h3>
              <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-[#1f2937] dark:border-[#1f2937]">
                <FeatureToggle title="State Management" description="Zustand for app-wide client state" checked={wizardState.stateManagement} onChange={wizardState.toggleStateManagement} />
                <FeatureToggle title="Data Fetching" description="TanStack Query for server state" checked={wizardState.dataFetching} onChange={wizardState.toggleDataFetching} />
                <FeatureToggle title="Forms" description="React Hook Form + Zod validation" checked={wizardState.forms} onChange={wizardState.toggleForms} />
                <FeatureToggle title="Monorepo" description="pnpm workspace-ready structure" checked={wizardState.monorepo} onChange={wizardState.toggleMonorepo} />
                <FeatureToggle title="RTL Support" description="Right-to-left layout helpers" checked={wizardState.rtl} onChange={wizardState.toggleRtl} />
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-5">
            <CommandBlock
              title="CLI Command"
              description="Run this command in your terminal."
              value={cliCommand}
              copied={copied === "cli"}
              onCopy={() => void copyToClipboard(cliCommand, "cli")}
            />
            <CommandBlock
              title="Share URL"
              description="Share this link to load the same visual preset."
              value={shareUrl}
              copied={copied === "url"}
              onCopy={() => void copyToClipboard(shareUrl, "url")}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                variant="outline"
                onClick={() => {
                  const text = "Check out my React Principles starter preset.";
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                Tweet
              </Button>
              <Button variant="outline" onClick={() => void sharePreset()}>
                Share
              </Button>
            </div>
          </div>
        )}
      </Dialog.Content>

      <Dialog.Footer className="justify-between">
        {step === 1 ? (
          <>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={() => setStep(2)}>Next</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={onClose}>Done</Button>
          </>
        )}
      </Dialog.Footer>
    </Dialog>
  );
}

interface FeatureToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function FeatureToggle({ title, description, checked, onChange }: FeatureToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <Switch checked={checked} onChange={onChange} size="sm" />
    </div>
  );
}

interface CommandBlockProps {
  title: string;
  description: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}

function CommandBlock({ title, description, value, copied, onCopy }: CommandBlockProps) {
  return (
    <section className="rounded-xl border border-slate-200 p-4 dark:border-[#1f2937]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onCopy} className="shrink-0 gap-1.5">
          <span className="material-symbols-outlined text-[16px]">{copied ? "check" : "content_copy"}</span>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
        <code>{value}</code>
      </pre>
    </section>
  );
}
