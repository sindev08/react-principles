import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
  render: () => (
    <StorySurface className="w-[420px]">
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Button</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
    </StorySurface>
  ),
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomSeparator: Story = {
  render: () => (
    <StorySurface className="w-[420px]">
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/nextjs">Next.js</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator>
            <span aria-hidden="true">→</span>
          </Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/nextjs/cookbook">Cookbook</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator>
            <span aria-hidden="true">→</span>
          </Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Server State</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>
    </StorySurface>
  ),
};
