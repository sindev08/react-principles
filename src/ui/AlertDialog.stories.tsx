import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { AlertDialog } from "./AlertDialog";
import { StatefulWrapper, StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/AlertDialog",
  component: AlertDialog,
  args: {
    open: false,
    onClose: () => {},
    onConfirm: () => {},
    title: "Confirm action",
    description: "This action cannot be undone.",
    variant: "default",
  },
  render: () => (
    <StatefulWrapper initial>
      {(open, setOpen) => (
        <StorySurface>
          <Button variant="destructive" onClick={() => setOpen(true)}>Delete story</Button>
          <AlertDialog
            open={open}
            onClose={() => setOpen(false)}
            onConfirm={() => setOpen(false)}
            title="Delete this Storybook story?"
            description="This action removes the example and cannot be undone."
            variant="destructive"
          />
        </StorySurface>
      )}
    </StatefulWrapper>
  ),
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = {};

export const Warning: Story = {
  render: () => (
    <StatefulWrapper initial>
      {(open, setOpen) => (
        <StorySurface>
          <Button onClick={() => setOpen(true)}>Open warning</Button>
          <AlertDialog
            open={open}
            onClose={() => setOpen(false)}
            onConfirm={() => setOpen(false)}
            title="Regenerate docs?"
            description="This will rebuild generated docs and may take a minute."
            variant="warning"
            confirmLabel="Continue"
          />
        </StorySurface>
      )}
    </StatefulWrapper>
  ),
};
