import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { StatefulWrapper, StorySurface } from "./storybook-utils";
import { Toast } from "./Toast";

const meta = {
  title: "UI/Toast",
  component: Toast,
  args: {
    open: false,
    onOpenChange: () => {},
    children: null,
    duration: 0,
    variant: "default",
    position: "top-right",
  },
  render: () => (
    <StatefulWrapper initial>
      {(open, setOpen) => (
        <StorySurface>
          <Button onClick={() => setOpen(true)}>Show toast</Button>
          <Toast open={open} onOpenChange={setOpen} variant="success" duration={0}>
            <Toast.Title>Storybook ready</Toast.Title>
            <Toast.Description>All UI primitives now have a visual review surface.</Toast.Description>
            <Toast.Footer>
              <Toast.Action>View</Toast.Action>
              <Toast.Close />
            </Toast.Footer>
          </Toast>
        </StorySurface>
      )}
    </StatefulWrapper>
  ),
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ErrorVariant: Story = {
  render: () => (
    <StatefulWrapper initial>
      {(open, setOpen) => (
        <StorySurface>
          <Button variant="destructive" onClick={() => setOpen(true)}>Show error</Button>
          <Toast open={open} onOpenChange={setOpen} variant="error" duration={0} position="bottom-right">
            <Toast.Title>Build failed</Toast.Title>
            <Toast.Description>Check the a11y panel for accessibility regressions.</Toast.Description>
            <Toast.Footer>
              <Toast.Close>Close</Toast.Close>
            </Toast.Footer>
          </Toast>
        </StorySurface>
      )}
    </StatefulWrapper>
  ),
};
