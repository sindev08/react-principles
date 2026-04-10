import type { Meta, StoryObj } from "@storybook/react";
import { FloatingLines } from "./FloatingLines";

const meta = {
  title: "UI/FloatingLines",
  component: FloatingLines,
  args: {
    linesGradient: ["#4628f1", "#7c3aed", "#06b6d4"],
    enabledWaves: ["top", "middle", "bottom"],
    lineCount: [4, 8, 5],
    lineDistance: [4, 3, 5],
    animationSpeed: 0.4,
    interactive: false,
  },
  render: (args) => (
    <div className="relative h-[320px] w-[760px] overflow-hidden rounded-3xl border border-slate-200 bg-[#020617]">
      <FloatingLines {...args} />
      <div className="relative z-10 flex h-full items-end p-8">
        <div>
          <p className="text-sm font-semibold text-white">Animated decorative background</p>
          <p className="mt-2 max-w-md text-sm text-slate-300">
            Disabled interactivity in Storybook keeps the preview stable while preserving motion.
          </p>
        </div>
      </div>
    </div>
  ),
} satisfies Meta<typeof FloatingLines>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
