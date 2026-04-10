import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./DatePicker";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/DatePicker",
  component: DatePicker,
  args: {
    label: "Release date",
    description: "Pick a date for the next component publish.",
    defaultValue: "2026-04-10",
  },
  render: (args) => (
    <StorySurface className="w-[360px]">
      <DatePicker {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ErrorState: Story = {
  args: {
    label: "Publish window",
    error: "Please choose a valid date in the future.",
    defaultValue: "2026-04-01",
  },
};
