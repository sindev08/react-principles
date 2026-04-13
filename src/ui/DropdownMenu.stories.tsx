import type { Meta, StoryObj } from "@storybook/react";
import { DropdownMenu } from "./DropdownMenu";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  args: {
    children: null,
    defaultOpen: true,
  },
  render: () => (
    <StorySurface className="flex w-[360px] justify-end">
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Quick actions</DropdownMenu.Label>
          <DropdownMenu.Item>Open docs</DropdownMenu.Item>
          <DropdownMenu.Item>View recipes</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item inset>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Item disabled>Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </StorySurface>
  ),
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
