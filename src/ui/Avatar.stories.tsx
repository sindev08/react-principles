import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  render: () => (
    <StorySurface className="flex items-center gap-4">
      <Avatar>
        <Avatar.Image src="https://i.pravatar.cc/120?img=8" alt="Singgih" />
        <Avatar.Fallback>SP</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Image src="/missing-avatar.png" alt="Broken avatar" />
        <Avatar.Fallback>RP</Avatar.Fallback>
      </Avatar>
    </StorySurface>
  ),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="flex items-center gap-4">
      <Avatar size="sm"><Avatar.Image src="/missing-sm.png" alt="" /><Avatar.Fallback>SM</Avatar.Fallback></Avatar>
      <Avatar size="md"><Avatar.Image src="/missing-md.png" alt="" /><Avatar.Fallback>MD</Avatar.Fallback></Avatar>
      <Avatar size="lg"><Avatar.Image src="/missing-lg.png" alt="" /><Avatar.Fallback>LG</Avatar.Fallback></Avatar>
      <Avatar size="xl"><Avatar.Image src="/missing-xl.png" alt="" /><Avatar.Fallback>XL</Avatar.Fallback></Avatar>
    </StorySurface>
  ),
};
