import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Card",
  component: Card,
  args: {
    variant: "default",
  },
  render: (args) => (
    <StorySurface padded={false} className="w-[360px] overflow-hidden border-none bg-transparent shadow-none">
      <Card {...args}>
        <Card.Header>
          <Card.Title>Storybook milestone</Card.Title>
          <Card.Description>Visual docs for the react-principles UI kit.</Card.Description>
        </Card.Header>
        <Card.Content>
          <Badge variant="info">Internal tooling</Badge>
        </Card.Content>
        <Card.Footer>
          <Button size="sm">Review</Button>
          <Button size="sm" variant="ghost">Later</Button>
        </Card.Footer>
      </Card>
    </StorySurface>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <StorySurface padded={false} className="grid w-[760px] grid-cols-3 gap-4 border-none bg-transparent shadow-none">
      {(["default", "elevated", "flat"] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <Card.Header>
            <Card.Title>{variant}</Card.Title>
            <Card.Description>Reusable surface styles.</Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-sm text-slate-600 dark:text-slate-400">Consistent spacing and hierarchy.</p>
          </Card.Content>
        </Card>
      ))}
    </StorySurface>
  ),
};
