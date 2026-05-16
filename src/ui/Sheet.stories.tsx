import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Sheet } from "./Sheet";
import { StorySurface } from "./storybook-utils";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/Sheet",
  component: Sheet,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const RightSide: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    return (
      <StorySurface className="min-h-[400px]">
        <div className="flex gap-4">
          <Sheet open={open} onOpenChange={setOpen} side="right">
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Right Sheet</Sheet.Title>
                <Sheet.Description>Slides in from the right side of the screen</Sheet.Description>
              </Sheet.Header>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This sheet slides in from the right edge (size controls width: 384px for md).
                </p>
              </div>
            </Sheet.Content>
          </Sheet>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Open Right Sheet
          </button>
        </div>
      </StorySurface>
    );
  },
};

export const LeftSide: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    return (
      <StorySurface className="min-h-[400px]">
        <div className="flex gap-4">
          <Sheet open={open} onOpenChange={setOpen} side="left">
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Left Sheet</Sheet.Title>
                <Sheet.Description>Slides in from the left side of the screen</Sheet.Description>
              </Sheet.Header>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This sheet slides in from the left edge (size controls width: 384px for md).
                </p>
              </div>
            </Sheet.Content>
          </Sheet>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Open Left Sheet
          </button>
        </div>
      </StorySurface>
    );
  },
};

export const TopSide: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    return (
      <StorySurface className="min-h-[400px]">
        <div className="flex flex-col gap-4">
          <Sheet open={open} onOpenChange={setOpen} side="top" size="sm">
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Top Sheet</Sheet.Title>
                <Sheet.Description>Slides in from the top of the screen</Sheet.Description>
              </Sheet.Header>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This sheet slides in from the top edge (size controls height: 50vh for sm).
                </p>
              </div>
            </Sheet.Content>
          </Sheet>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Open Top Sheet
          </button>
        </div>
      </StorySurface>
    );
  },
};

export const BottomSide: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    return (
      <StorySurface className="min-h-[400px]">
        <div className="flex flex-col gap-4">
          <Sheet open={open} onOpenChange={setOpen} side="bottom" size="sm">
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Bottom Sheet</Sheet.Title>
                <Sheet.Description>Slides in from the bottom of the screen</Sheet.Description>
              </Sheet.Header>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This sheet slides in from the bottom edge (size controls height: 50vh for sm).
                </p>
              </div>
            </Sheet.Content>
          </Sheet>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Open Bottom Sheet
          </button>
        </div>
      </StorySurface>
    );
  },
};

export const AllSides: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [side, setSide] = useState<"top" | "right" | "bottom" | "left">("right");

    return (
      <StorySurface className="min-h-[400px]">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Side
            </label>
            <div className="flex flex-wrap gap-2">
              {(["top", "right", "bottom", "left"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-sm transition-colors",
                    side === s
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-[#1f2937] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#161b22]"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Sheet open={open} onOpenChange={setOpen} side={side}>
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>{side.charAt(0).toUpperCase() + side.slice(1)} Sheet</Sheet.Title>
                <Sheet.Description>Slides in from the {side} side</Sheet.Description>
              </Sheet.Header>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This is a {side} sheet. Use the buttons above to switch between different sides.
                </p>
              </div>
            </Sheet.Content>
          </Sheet>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Open Sheet
          </button>
        </div>
      </StorySurface>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [size, setSize] = useState<"sm" | "md" | "lg" | "xl" | "full">("md");

    return (
      <StorySurface className="min-h-[400px]">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Size
            </label>
            <div className="flex flex-wrap gap-2">
              {(["sm", "md", "lg", "xl", "full"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-sm transition-colors",
                    size === s
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-[#1f2937] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#161b22]"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Sheet open={open} onOpenChange={setOpen} side="right" size={size}>
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Size: {size}</Sheet.Title>
                <Sheet.Description>
                  {size === "full" ? "Full viewport" : `${size} sheet`}
                </Sheet.Description>
              </Sheet.Header>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {size === "sm" && "Small sheet (width: 320px for left/right)"}
                  {size === "md" && "Medium sheet (width: 384px for left/right)"}
                  {size === "lg" && "Large sheet (width: 512px for left/right)"}
                  {size === "xl" && "Extra large sheet (width: 576px for left/right)"}
                  {size === "full" && "Full viewport (100% width/height)"}
                </p>
              </div>
            </Sheet.Content>
          </Sheet>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Open Sheet
          </button>
        </div>
      </StorySurface>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    return (
      <StorySurface className="min-h-[400px]">
        <div className="flex gap-4">
          <Sheet open={open} onOpenChange={setOpen} side="right">
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Confirm Action</Sheet.Title>
                <Sheet.Description>Are you sure you want to proceed?</Sheet.Description>
              </Sheet.Header>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This sheet demonstrates the use of a footer with action buttons. The footer
                  is useful for primary and secondary actions like confirm/cancel.
                </p>
              </div>
              <Sheet.Footer>
                <Sheet.Close>Cancel</Sheet.Close>
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Confirm
                </button>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Open Sheet with Footer
          </button>
        </div>
      </StorySurface>
    );
  },
};

export const ComplexForm: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    return (
      <StorySurface className="min-h-[400px]">
        <div className="flex gap-4">
          <Sheet open={open} onOpenChange={setOpen} side="right" size="lg">
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Edit Profile</Sheet.Title>
                <Sheet.Description>Update your personal information</Sheet.Description>
              </Sheet.Header>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-[#1f2937] rounded-sm bg-white dark:bg-[#0d1117] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-[#1f2937] rounded-sm bg-white dark:bg-[#0d1117] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Software developer and open source contributor."
                    className="w-full px-4 py-2 border border-slate-300 dark:border-[#1f2937] rounded-sm bg-white dark:bg-[#0d1117] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </form>
              <Sheet.Footer>
                <Sheet.Close>Cancel</Sheet.Close>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Open Form Sheet
          </button>
        </div>
      </StorySurface>
    );
  },
};
