import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";
import { StorySurface } from "./storybook-utils";
import { useState } from "react";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySurface className="w-[420px]">
      <Spinner />
    </StorySurface>
  ),
};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Small</span>
        </div>
        <div className="flex items-center gap-2">
          <Spinner size="md" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <Spinner size="lg" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Large</span>
        </div>
      </div>
    </StorySurface>
  ),
};

export const Variants: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Spinner variant="default" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Default variant</span>
        </div>
        <div className="flex items-center gap-2">
          <Spinner variant="muted" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Muted variant</span>
        </div>
      </div>

      <div className="p-4 bg-primary rounded-lg">
        <div className="flex items-center gap-2">
          <Spinner variant="muted" />
          <span className="text-sm text-white">On colored background</span>
        </div>
      </div>

      <div className="p-4 bg-slate-900 dark:bg-white rounded-lg">
        <div className="flex items-center gap-2">
          <Spinner variant="muted" />
          <span className="text-sm text-white dark:text-slate-900">On dark background</span>
        </div>
      </div>
    </StorySurface>
  ),
};

export const WithText: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <div className="flex items-center gap-3">
        <Spinner />
        <span className="text-sm text-slate-700 dark:text-slate-300">Loading data...</span>
      </div>

      <div className="flex items-center gap-3">
        <Spinner size="sm" />
        <span className="text-sm text-slate-700 dark:text-slate-300">Saving changes...</span>
      </div>

      <div className="flex items-center gap-3">
        <Spinner size="lg" />
        <span className="text-sm text-slate-700 dark:text-slate-300">Processing large file...</span>
      </div>

      <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-[#161b22] rounded-lg border border-slate-200 dark:border-[#1f2937]">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <span className="text-sm text-slate-700 dark:text-slate-300">Loading page content...</span>
        </div>
      </div>
    </StorySurface>
  ),
};

export const CustomLabel: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <div className="space-y-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Default label: "Loading..."
        </p>
        <div className="flex items-center gap-2">
          <Spinner />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Custom label: "Please wait..."
        </p>
        <div className="flex items-center gap-2">
          <Spinner label="Please wait..." />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Custom label: "Authenticating..."
        </p>
        <div className="flex items-center gap-2">
          <Spinner label="Authenticating..." />
        </div>
      </div>
    </StorySurface>
  ),
};

export const CompleteExample: Story = {
  render: () => {
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(false);

    return (
      <StorySurface className="w-[420px] space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Loading States</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white dark:bg-[#0d1117] rounded-lg border border-slate-200 dark:border-[#1f2937]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Data fetch</span>
                {loading1 ? (
                  <Spinner size="sm" />
                ) : (
                  <span className="text-xs text-slate-500 dark:text-slate-400">Complete</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#0d1117] rounded-lg border border-slate-200 dark:border-[#1f2937]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300">Form submission</span>
                {loading2 ? (
                  <Spinner size="sm" variant="muted" />
                ) : (
                  <span className="text-xs text-slate-500 dark:text-slate-400">Complete</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Button States</h3>
          <div className="flex flex-wrap gap-2">
            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white opacity-50 cursor-not-allowed"
            >
              <Spinner size="sm" />
              <span>Loading...</span>
            </button>

            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] text-slate-900 dark:text-white opacity-50 cursor-not-allowed"
            >
              <Spinner size="sm" variant="muted" />
              <span>Processing...</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Page Loading</h3>
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-[#161b22] rounded-lg border border-slate-200 dark:border-[#1f2937]">
            <Spinner size="lg" />
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">Loading your dashboard...</p>
          </div>
        </div>
      </StorySurface>
    );
  },
};
