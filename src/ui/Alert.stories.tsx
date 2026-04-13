import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Alert",
  component: Alert,
  args: {
    variant: "default",
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <Alert {...args}>
        <Alert.Title>Release window updated</Alert.Title>
        <Alert.Description>
          Storybook is now available for local visual QA and component review.
        </Alert.Description>
        <Alert.Footer>
          <Alert.Action>View docs</Alert.Action>
        </Alert.Footer>
      </Alert>
    </StorySurface>
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <StorySurface className="grid w-[480px] gap-4">
      {(["default", "success", "warning", "error", "info"] as const).map((variant) => (
        <Alert key={variant} variant={variant}>
          <Alert.Title>{variant[0]?.toUpperCase()}{variant.slice(1)} alert</Alert.Title>
          <Alert.Description>Consistent feedback styles across the UI kit.</Alert.Description>
        </Alert>
      ))}
    </StorySurface>
  ),
};

export const WithCustomActions: Story = {
  render: () => (
    <StorySurface className="w-[420px]">
      <Alert variant="info">
        <Alert.Title>Need a follow-up review?</Alert.Title>
        <Alert.Description>
          Pair an inline alert with contextual primary and secondary actions.
        </Alert.Description>
        <Alert.Footer>
          <Button size="sm">Open PR</Button>
          <Button size="sm" variant="ghost">
            Dismiss
          </Button>
        </Alert.Footer>
      </Alert>
    </StorySurface>
  ),
};
