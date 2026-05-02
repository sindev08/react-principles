import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";
import { StorySurface } from "./storybook-utils";
import { Input } from "./Input";

const meta = {
  title: "UI/Label",
  component: Label,
  args: {
    children: "Email address",
    required: false,
  },
  render: (args) => (
    <StorySurface className="w-[360px]">
      <Label {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    children: "Password",
    required: true,
  },
};

export const Disabled: Story = {
  render: () => (
    <StorySurface className="w-[360px]">
      <div className="opacity-50">
        <Label>Muted field label</Label>
      </div>
    </StorySurface>
  ),
};

export const WithInput: Story = {
  render: () => (
    <StorySurface className="grid w-[420px] gap-4">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" placeholder="you@example.com" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="password" required>
          Password
        </Label>
        <Input id="password" type="password" placeholder="Enter password" className="mt-1.5" />
      </div>
      <div className="opacity-50">
        <Label htmlFor="disabled">Disabled field</Label>
        <Input id="disabled" placeholder="Cannot edit" disabled className="mt-1.5" />
      </div>
      <div className="opacity-50">
        <Label htmlFor="readonly">Read-only field</Label>
        <Input id="readonly" value="Locked content" readOnly className="mt-1.5" />
      </div>
    </StorySurface>
  ),
};
