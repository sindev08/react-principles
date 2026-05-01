"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryState } from "nuqs";
import { DocsHeader } from "@/features/docs/components/DocsHeader";
import { ConfiguratorSidebar } from "@/features/configurator/components/ConfiguratorSidebar";
import { CreateProjectModal } from "@/features/configurator/components/CreateProjectModal";
import { LivePreviewPanel } from "@/features/configurator/components/LivePreviewPanel";
import { decodePreset, encodePreset } from "@/features/configurator/lib";
import { useWizardStore } from "@/features/configurator/stores/useWizardStore";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Button } from "@/ui/Button";
import { Drawer } from "@/ui/Drawer";

export default function CreatePage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [presetParam, setPresetParam] = useQueryState("preset", {
    history: "replace",
    shallow: true,
  });

  const { hydrateFromPreset, getPresetConfig } = useWizardStore();

  const didHydrateFromUrlRef = useRef(false);
  const skipNextUrlWriteRef = useRef(false);

  useEffect(() => {
    if (didHydrateFromUrlRef.current) return;

    if (presetParam) {
      const preset = decodePreset(presetParam);
      hydrateFromPreset(preset);
      skipNextUrlWriteRef.current = true;
    }

    didHydrateFromUrlRef.current = true;
  }, [hydrateFromPreset, presetParam]);

  const encodedPreset = encodePreset(getPresetConfig());
  const debouncedPreset = useDebounce(encodedPreset, 250);

  useEffect(() => {
    if (!didHydrateFromUrlRef.current) return;

    if (skipNextUrlWriteRef.current) {
      skipNextUrlWriteRef.current = false;
      return;
    }

    if (debouncedPreset !== presetParam) {
      void setPresetParam(debouncedPreset);
    }
  }, [debouncedPreset, presetParam, setPresetParam]);

  const openCreateModal = () => {
    setCreateModalOpen(true);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0b0e14] dark:text-white">
      <DocsHeader />

      <main className="min-h-[calc(100vh-3.5rem)] lg:flex">
        <div className="hidden lg:block lg:w-[320px] lg:shrink-0">
          <ConfiguratorSidebar onOpenCreateModal={openCreateModal} className="lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)]" />
        </div>

        <section className="flex-1 border-slate-200 bg-slate-50/80 dark:border-[#1f2937] dark:bg-[#0d1117]">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-[#1f2937] dark:bg-[#0b0e14]/80 lg:hidden">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Configurator</p>
              <h1 className="text-base font-semibold text-slate-900 dark:text-white">Create Project</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => setMobileSidebarOpen(true)} className="gap-2">
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Configure
            </Button>
          </div>

          <div className="mx-auto w-full max-w-[1280px] p-4 sm:p-6 lg:p-8">
            <div className="mb-6 hidden lg:block">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Configurator</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Create Project
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                Tune the visual system freely, preview it in context, then generate a CLI preset when it feels right.
              </p>
            </div>
            <LivePreviewPanel />
          </div>
        </section>
      </main>

      <Drawer open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} side="left" size="full">
        <ConfiguratorSidebar onOpenCreateModal={openCreateModal} />
      </Drawer>

      <CreateProjectModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  );
}
