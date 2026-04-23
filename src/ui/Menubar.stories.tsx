import type { Meta, StoryObj } from "@storybook/react";
import { Menubar } from "./Menubar";
import { StorySurface } from "./storybook-utils";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/Menubar",
  component: Menubar,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <StorySurface>
      <Menubar className="p-4">
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item onSelect={() => {}}>
              New Tab <Menubar.Shortcut>⌘T</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Item onSelect={() => {}}>
              New Window <Menubar.Shortcut>⌘N</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item onSelect={() => {}}>
              Open... <Menubar.Shortcut>⌘O</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Item onSelect={() => {}}>
              Save <Menubar.Shortcut>⌘S</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item onSelect={() => {}}>
              Print... <Menubar.Shortcut>⌘P</Menubar.Shortcut>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger>Edit</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item onSelect={() => {}}>
              Undo <Menubar.Shortcut>⌘Z</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Item onSelect={() => {}}>
              Redo <Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Separator />
            <Menubar.Item onSelect={() => {}}>
              Cut <Menubar.Shortcut>⌘X</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Item onSelect={() => {}}>
              Copy <Menubar.Shortcut>⌘C</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Item onSelect={() => {}}>
              Paste <Menubar.Shortcut>⌘V</Menubar.Shortcut>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger>View</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.CheckboxItem defaultChecked>
              Always Show Bookmarks Bar
            </Menubar.CheckboxItem>
            <Menubar.CheckboxItem>
              Show Full URLs
            </Menubar.CheckboxItem>
            <Menubar.Separator />
            <Menubar.Item onSelect={() => {}}>
              Reload <Menubar.Shortcut>⌘R</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Item onSelect={() => {}}>
              Force Reload <Menubar.Shortcut>⇧⌘R</Menubar.Shortcut>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>
    </StorySurface>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <StorySurface>
      <Menubar className="p-4">
        <Menubar.Menu>
          <Menubar.Trigger>Preferences</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.CheckboxItem defaultChecked>
              Show Toolbar
            </Menubar.CheckboxItem>
            <Menubar.CheckboxItem defaultChecked>
              Show Sidebar
            </Menubar.CheckboxItem>
            <Menubar.CheckboxItem>
              Show Status Bar
            </Menubar.CheckboxItem>
            <Menubar.Separator />
            <Menubar.CheckboxItem>
              Dark Mode
            </Menubar.CheckboxItem>
            <Menubar.CheckboxItem defaultChecked>
              Auto-save
            </Menubar.CheckboxItem>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>
    </StorySurface>
  ),
};

export const WithRadio: Story = {
  render: () => (
    <StorySurface>
      <Menubar className="p-4">
        <Menubar.Menu>
          <Menubar.Trigger>View</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.RadioGroup defaultValue="comfortable">
              <Menubar.RadioItem value="compact">
                Compact
              </Menubar.RadioItem>
              <Menubar.RadioItem value="default">
                Default
              </Menubar.RadioItem>
              <Menubar.RadioItem value="comfortable">
                Comfortable
              </Menubar.RadioItem>
            </Menubar.RadioGroup>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger>Theme</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.RadioGroup defaultValue="system">
              <Menubar.RadioItem value="light">
                Light
              </Menubar.RadioItem>
              <Menubar.RadioItem value="dark">
                Dark
              </Menubar.RadioItem>
              <Menubar.RadioItem value="system">
                System
              </Menubar.RadioItem>
            </Menubar.RadioGroup>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>
    </StorySurface>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <StorySurface>
      <Menubar className="p-4">
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item onSelect={() => {}}>
              New <Menubar.Shortcut>⌘N</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Sub>
              <Menubar.SubTrigger>Open Recent</Menubar.SubTrigger>
              <Menubar.Content>
                <Menubar.Item onSelect={() => {}}>
                  home.html
                </Menubar.Item>
                <Menubar.Item onSelect={() => {}}>
                  about.html
                </Menubar.Item>
                <Menubar.Item onSelect={() => {}}>
                  contact.html
                </Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item onSelect={() => {}}>
                  More...
                </Menubar.Item>
              </Menubar.Content>
            </Menubar.Sub>
            <Menubar.Separator />
            <Menubar.Item onSelect={() => {}}>
              Save <Menubar.Shortcut>⌘S</Menubar.Shortcut>
            </Menubar.Item>
            <Menubar.Item onSelect={() => {}}>
              Close <Menubar.Shortcut>⌘W</Menubar.Shortcut>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger>Tools</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Sub>
              <Menubar.SubTrigger>Spelling & Grammar</Menubar.SubTrigger>
              <Menubar.Content>
                <Menubar.CheckboxItem defaultChecked>
                  Check Spelling
                </Menubar.CheckboxItem>
                <Menubar.CheckboxItem defaultChecked>
                  Check Grammar
                </Menubar.CheckboxItem>
                <Menubar.Separator />
                <Menubar.RadioGroup defaultValue="en">
                  <Menubar.RadioItem value="en">
                    English
                  </Menubar.RadioItem>
                  <Menubar.RadioItem value="id">
                    Indonesian
                  </Menubar.RadioItem>
                  <Menubar.RadioItem value="ja">
                    Japanese
                  </Menubar.RadioItem>
                </Menubar.RadioGroup>
              </Menubar.Content>
            </Menubar.Sub>
            <Menubar.Separator />
            <Menubar.Item onSelect={() => {}}>
              Word Count
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>
    </StorySurface>
  ),
};
