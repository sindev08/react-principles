import type { Meta, StoryObj } from "@storybook/react";
import { PageProgress } from "./PageProgress";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/PageProgress",
  component: PageProgress,
  args: {
    progress: 72,
    visible: true,
  },
  render: (args) => (
    <div className="relative h-20 w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#1f2937] dark:bg-[#0b0e14]">
      <PageProgress {...args} />
      <StorySurface className="h-full rounded-none border-none bg-transparent shadow-none">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Thin top progress indicator for navigation feedback.
        </p>
      </StorySurface>
    </div>
  ),
} satisfies Meta<typeof PageProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {};

export const Hidden: Story = {
  args: {
    visible: false,
  },
};
