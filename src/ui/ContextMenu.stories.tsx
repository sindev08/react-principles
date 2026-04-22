import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu } from "./ContextMenu";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/ContextMenu",
  component: ContextMenu,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <StorySurface>
      <ContextMenu>
        <ContextMenu.Trigger className="rounded-lg border border-slate-200 dark:border-[#1f2937] px-4 py-8 w-full text-center text-sm text-slate-500 dark:text-slate-400">
          Right-click here
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onSelect={() => {}}>
            Back <ContextMenu.Shortcut>Alt+Left</ContextMenu.Shortcut>
          </ContextMenu.Item>
          <ContextMenu.Item onSelect={() => {}}>
            Forward <ContextMenu.Shortcut>Alt+Right</ContextMenu.Shortcut>
          </ContextMenu.Item>
          <ContextMenu.Item onSelect={() => {}}>
            Reload <ContextMenu.Shortcut>⌘R</ContextMenu.Shortcut>
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item onSelect={() => {}}>Save As...</ContextMenu.Item>
          <ContextMenu.Item onSelect={() => {}}>Print...</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </StorySurface>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <StorySurface>
      <ContextMenu>
        <ContextMenu.Trigger className="rounded-lg border border-slate-200 dark:border-[#1f2937] px-4 py-8 w-full text-center text-sm text-slate-500 dark:text-slate-400">
          Right-click here
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.CheckboxItem defaultChecked>
            Show Bookmarks Bar
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem defaultChecked>
            Show Full URLs
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem>
            Show Status Bar
          </ContextMenu.CheckboxItem>
          <ContextMenu.Separator />
          <ContextMenu.Item onSelect={() => {}}>Settings</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </StorySurface>
  ),
};

export const WithRadio: Story = {
  render: () => (
    <StorySurface>
      <ContextMenu>
        <ContextMenu.Trigger className="rounded-lg border border-slate-200 dark:border-[#1f2937] px-4 py-8 w-full text-center text-sm text-slate-500 dark:text-slate-400">
          Right-click here
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.RadioGroup defaultValue="system">
            <ContextMenu.RadioItem value="light">Light</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="dark">Dark</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="system">System</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
          <ContextMenu.Separator />
          <ContextMenu.CheckboxItem defaultChecked>Auto-save</ContextMenu.CheckboxItem>
        </ContextMenu.Content>
      </ContextMenu>
    </StorySurface>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <StorySurface>
      <ContextMenu>
        <ContextMenu.Trigger className="rounded-lg border border-slate-200 dark:border-[#1f2937] px-4 py-8 w-full text-center text-sm text-slate-500 dark:text-slate-400">
          Right-click here
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onSelect={() => {}}>New Tab <ContextMenu.Shortcut>⌘T</ContextMenu.Shortcut></ContextMenu.Item>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>Open Recent</ContextMenu.SubTrigger>
            <ContextMenu.Content>
              <ContextMenu.Item onSelect={() => {}}>home.html</ContextMenu.Item>
              <ContextMenu.Item onSelect={() => {}}>about.html</ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item onSelect={() => {}}>More...</ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Sub>
          <ContextMenu.Separator />
          <ContextMenu.Item onSelect={() => {}}>
            Save <ContextMenu.Shortcut>⌘S</ContextMenu.Shortcut>
          </ContextMenu.Item>
          <ContextMenu.Item onSelect={() => {}}>
            Close <ContextMenu.Shortcut>⌘W</ContextMenu.Shortcut>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </StorySurface>
  ),
};
