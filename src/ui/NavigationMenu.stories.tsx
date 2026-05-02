import type { Meta, StoryObj } from "@storybook/react";
import { NavigationMenu } from "./NavigationMenu";
import { StorySurface } from "./storybook-utils";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/NavigationMenu",
  component: NavigationMenu,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <StorySurface>
      <NavigationMenu className="p-4">
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]">
                Electronics
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]">
                Clothing
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]">
                Books
              </a>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Solutions</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]">
                Marketing
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]">
                Analytics
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]">
                Commerce
              </a>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="/documentation">Documentation</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </StorySurface>
  ),
};

export const WithLinks: Story = {
  render: () => (
    <StorySurface>
      <NavigationMenu className="p-4">
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger asChild>
              <a href="/products">Products</a>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/products/electronics">Electronics</NavigationMenu.Link>
              <NavigationMenu.Link href="/products/clothing">Clothing</NavigationMenu.Link>
              <NavigationMenu.Link href="/products/books">Books</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger asChild>
              <a href="/solutions">Solutions</a>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/solutions/marketing">Marketing</NavigationMenu.Link>
              <NavigationMenu.Link href="/solutions/analytics">Analytics</NavigationMenu.Link>
              <NavigationMenu.Link href="/solutions/commerce">Commerce</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="/about">About</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </StorySurface>
  ),
};

export const Complex: Story = {
  render: () => (
    <StorySurface>
      <NavigationMenu className="p-4">
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Platform</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="p-2 space-y-1">
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937] rounded-sm">
                  Overview
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937] rounded-sm">
                  Features
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937] rounded-sm">
                  Pricing
                </a>
                <div className="border-t border-slate-200 dark:border-[#1f2937] my-1"></div>
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937] rounded-sm">
                  Documentation
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937] rounded-sm">
                  API Reference
                </a>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Company</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <div className="p-2 space-y-1">
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937] rounded-sm">
                  About Us
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937] rounded-sm">
                  Careers
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937] rounded-sm">
                  Blog
                </a>
                <div className="border-t border-slate-200 dark:border-[#1f2937] my-1"></div>
                <a href="#" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937] rounded-sm">
                  Contact
                </a>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="/login">Sign In</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </StorySurface>
  ),
};

export const SingleLevel: Story = {
  render: () => (
    <StorySurface>
      <NavigationMenu className="p-4">
        <NavigationMenu.List>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/">Home</NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="/about">About</NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="/services">Services</NavigationMenu.Link>
          </NavigationMenu.Item>

          <NavigationMenu.Item>
            <NavigationMenu.Link href="/contact">Contact</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </StorySurface>
  ),
};
