import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./Calendar";
import { StorySurface } from "./storybook-utils";

const today = new Date();
today.setHours(0, 0, 0, 0);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  args: {
    mode: "single",
    defaultSelected: today,
  },
  render: (args) => (
    <StorySurface className="w-[400px]">
      <Calendar {...args} className="w-full" />
    </StorySurface>
  ),
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Range: Story = {
  args: {
    mode: "range",
    defaultSelected: { from: today, to: nextWeek },
  },
};

export const Multiple: Story = {
  args: {
    mode: "multiple",
    defaultSelected: [today, nextWeek, nextMonth],
  },
};

export const DisabledWeekends: Story = {
  args: {
    mode: "single",
    disabled: [(d: Date) => d.getDay() === 0 || d.getDay() === 6],
  },
};

export const NoOutsideDays: Story = {
  args: { showOutsideDays: false },
};

export const WithBounds: Story = {
  args: {
    fromDate: new Date(today.getFullYear(), today.getMonth(), 5),
    toDate: new Date(today.getFullYear(), today.getMonth(), 25),
  },
};
