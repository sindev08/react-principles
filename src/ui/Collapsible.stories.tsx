import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Collapsible } from "./Collapsible";
import { StorySurface } from "./storybook-utils";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/Collapsible",
  component: Collapsible,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <StorySurface className="w-96">
      <Collapsible>
        <Collapsible.Trigger className="px-4 py-2 bg-slate-100 dark:bg-[#1f2937] hover:bg-slate-200 dark:hover:bg-[#161b22] transition-colors">
          <span className="text-sm font-medium text-slate-900 dark:text-white">Click to toggle</span>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="p-4 bg-slate-50 dark:bg-[#0d1117]">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Content that animates smoothly when toggling. The animation uses CSS Grid transitions
              for a smooth height effect.
            </p>
          </div>
        </Collapsible.Content>
      </Collapsible>
    </StorySurface>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <StorySurface className="w-96">
      <Collapsible defaultOpen>
        <Collapsible.Trigger className="px-4 py-2 bg-slate-100 dark:bg-[#1f2937] hover:bg-slate-200 dark:hover:bg-[#161b22] transition-colors">
          <span className="text-sm font-medium text-slate-900 dark:text-white">Starts Open</span>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="p-4 bg-slate-50 dark:bg-[#0d1117]">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This content starts expanded because of the <code>defaultOpen</code> prop.
            </p>
          </div>
        </Collapsible.Content>
      </Collapsible>
    </StorySurface>
  ),
};

export const WithChevron: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open] = React.useState(false);
    return (
      <StorySurface className="w-96">
        <Collapsible>
          <Collapsible.Trigger className="px-4 py-2 bg-slate-100 dark:bg-[#1f2937] hover:bg-slate-200 dark:hover:bg-[#161b22] transition-colors">
            <span className="text-sm font-medium text-slate-900 dark:text-white">Section with Icon</span>
            <svg
              className="h-4 w-4 text-slate-400 transition-transform duration-200 [&[data-state=open]]:rotate-180"
              data-state={open ? "open" : "closed"}
              viewBox="0 0 16 16"
              fill="none"
            >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="p-4 bg-slate-50 dark:bg-[#0d1117]">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The chevron icon rotates when the section is toggled. You can add this icon to your
              trigger and animate it with a transition.
            </p>
          </div>
        </Collapsible.Content>
      </Collapsible>
    </StorySurface>
    );
  }
};

export const Disabled: Story = {
  render: () => (
    <StorySurface className="w-96">
      <Collapsible disabled>
        <Collapsible.Trigger className="px-4 py-2 bg-slate-100 dark:bg-[#1f2937]">
          <span className="text-sm font-medium text-slate-900 dark:text-white">Cannot Toggle</span>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="p-4 bg-slate-50 dark:bg-[#0d1117]">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This section is locked and cannot be toggled due to the <code>disabled</code> prop.
            </p>
          </div>
        </Collapsible.Content>
      </Collapsible>
    </StorySurface>
  ),
};

export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = React.useState(false);

    return (
      <StorySurface className="w-96">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(!open)}
              className="px-3 py-1 text-sm bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors"
            >
              {open ? "Close" : "Open"} Externally
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              State: {open ? "open" : "closed"}
            </span>
          </div>
          <Collapsible open={open} onOpenChange={setOpen}>
            <Collapsible.Trigger className="px-4 py-2 bg-slate-100 dark:bg-[#1f2937] hover:bg-slate-200 dark:hover:bg-[#161b22] transition-colors">
              <span className="text-sm font-medium text-slate-900 dark:text-white">Controlled</span>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <div className="p-4 bg-slate-50 dark:bg-[#0d1117]">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This collapsible is controlled by external state. Both the external button and the
                  trigger can toggle the section.
                </p>
              </div>
            </Collapsible.Content>
          </Collapsible>
        </div>
      </StorySurface>
    );
  },
};
