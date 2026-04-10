import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { StatefulWrapper, StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  args: {
    open: false,
    onClose: () => {},
    children: null,
    size: "md",
  },
  render: () => (
    <StatefulWrapper initial>
      {(open, setOpen) => (
        <StorySurface>
          <Button onClick={() => setOpen(true)}>Open dialog</Button>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <Dialog.Header>
              <Dialog.Title>Publish release notes</Dialog.Title>
              <Dialog.Description>
                Confirm the copy before publishing this update to the docs site.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Content>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This modal uses portal rendering, scroll lock, and escape handling.
              </p>
            </Dialog.Content>
            <Dialog.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Publish</Button>
            </Dialog.Footer>
          </Dialog>
        </StorySurface>
      )}
    </StatefulWrapper>
  ),
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  render: () => (
    <StatefulWrapper initial>
      {(open, setOpen) => (
        <StorySurface>
          <Button onClick={() => setOpen(true)}>Open large dialog</Button>
          <Dialog open={open} onClose={() => setOpen(false)} size="xl">
            <Dialog.Header>
              <Dialog.Title>Extended preview</Dialog.Title>
              <Dialog.Description>
                Larger surface for content-heavy review flows.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Content>
              <div className="h-40 rounded-xl border border-dashed border-slate-200 dark:border-[#1f2937]" />
            </Dialog.Content>
          </Dialog>
        </StorySurface>
      )}
    </StatefulWrapper>
  ),
};
