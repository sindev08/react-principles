import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Drawer } from "./Drawer";
import { StatefulWrapper, StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Drawer",
  component: Drawer,
  args: {
    open: false,
    onClose: () => {},
    children: null,
    side: "right",
    size: "md",
  },
  render: () => (
    <StatefulWrapper initial>
      {(open, setOpen) => (
        <StorySurface>
          <Button onClick={() => setOpen(true)}>Open drawer</Button>
          <Drawer open={open} onClose={() => setOpen(false)}>
            <Drawer.Header>
              <Drawer.Title>Preview navigation</Drawer.Title>
              <Drawer.Description>Side panel for supporting actions and settings.</Drawer.Description>
            </Drawer.Header>
            <Drawer.Content>
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 p-3 dark:border-[#1f2937]">Theme controls</div>
                <div className="rounded-lg border border-slate-200 p-3 dark:border-[#1f2937]">Canvas settings</div>
              </div>
            </Drawer.Content>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </Drawer.Footer>
          </Drawer>
        </StorySurface>
      )}
    </StatefulWrapper>
  ),
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LeftSide: Story = {
  render: () => (
    <StatefulWrapper initial>
      {(open, setOpen) => (
        <StorySurface>
          <Button onClick={() => setOpen(true)}>Open left drawer</Button>
          <Drawer open={open} onClose={() => setOpen(false)} side="left" size="sm">
            <Drawer.Header>
              <Drawer.Title>Short menu</Drawer.Title>
            </Drawer.Header>
            <Drawer.Content>
              <p className="text-sm text-slate-600 dark:text-slate-400">Alternate placement for navigation-heavy layouts.</p>
            </Drawer.Content>
          </Drawer>
        </StorySurface>
      )}
    </StatefulWrapper>
  ),
};
