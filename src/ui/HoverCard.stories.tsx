import type { Meta, StoryObj } from "@storybook/react";
import { HoverCard } from "./HoverCard";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/HoverCard",
  component: HoverCard,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <StorySurface>
      <HoverCard>
        <HoverCard.Trigger className="cursor-pointer rounded-md border border-slate-200 dark:border-[#1f2937] px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161b22]">
          Hover over me
        </HoverCard.Trigger>
        <HoverCard.Content>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">@sindev08</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Software Engineer building open-source UI components.
            </p>
          </div>
        </HoverCard.Content>
      </HoverCard>
    </StorySurface>
  ),
};

export const AllSides: Story = {
  render: () => (
    <StorySurface>
      <div className="flex flex-wrap items-center justify-center gap-12 py-20">
        <HoverCard side="top">
          <HoverCard.Trigger className="cursor-pointer rounded-md border border-slate-200 dark:border-[#1f2937] px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300">
            Top
          </HoverCard.Trigger>
          <HoverCard.Content>
            <p className="text-sm text-slate-600 dark:text-slate-400">Appears on top</p>
          </HoverCard.Content>
        </HoverCard>

        <HoverCard side="right">
          <HoverCard.Trigger className="cursor-pointer rounded-md border border-slate-200 dark:border-[#1f2937] px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300">
            Right
          </HoverCard.Trigger>
          <HoverCard.Content>
            <p className="text-sm text-slate-600 dark:text-slate-400">Appears on right</p>
          </HoverCard.Content>
        </HoverCard>

        <HoverCard side="bottom">
          <HoverCard.Trigger className="cursor-pointer rounded-md border border-slate-200 dark:border-[#1f2937] px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300">
            Bottom
          </HoverCard.Trigger>
          <HoverCard.Content>
            <p className="text-sm text-slate-600 dark:text-slate-400">Appears on bottom</p>
          </HoverCard.Content>
        </HoverCard>

        <HoverCard side="left">
          <HoverCard.Trigger className="cursor-pointer rounded-md border border-slate-200 dark:border-[#1f2937] px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300">
            Left
          </HoverCard.Trigger>
          <HoverCard.Content>
            <p className="text-sm text-slate-600 dark:text-slate-400">Appears on left</p>
          </HoverCard.Content>
        </HoverCard>
      </div>
    </StorySurface>
  ),
};

export const CustomDelays: Story = {
  render: () => (
    <StorySurface>
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCard.Trigger className="cursor-pointer rounded-md border border-slate-200 dark:border-[#1f2937] px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300">
          Instant (0ms delay)
        </HoverCard.Trigger>
        <HoverCard.Content>
          <p className="text-sm text-slate-600 dark:text-slate-400">Opens and closes instantly</p>
        </HoverCard.Content>
      </HoverCard>
    </StorySurface>
  ),
};

export const RichContent: Story = {
  render: () => (
    <StorySurface>
      <HoverCard>
        <HoverCard.Trigger className="cursor-pointer text-sm font-medium text-primary underline underline-offset-4">
          reactprinciples.dev
        </HoverCard.Trigger>
        <HoverCard.Content>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">RP</div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">React Principles</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">reactprinciples.dev</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A living cookbook and UI kit for modern React development with production-grade patterns.
            </p>
          </div>
        </HoverCard.Content>
      </HoverCard>
    </StorySurface>
  ),
};
