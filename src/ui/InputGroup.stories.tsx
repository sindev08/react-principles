import type { Meta, StoryObj } from "@storybook/react";
import { InputGroup } from "./InputGroup";
import { StorySurface } from "./storybook-utils";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M6 4h4a2 2 0 0 1 0 4H8a2 2 0 0 0 0 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M4 12l8-8M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/InputGroup",
  component: InputGroup,
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <InputGroup
        label="Search"
        placeholder="Search components..."
        prefix={<SearchIcon />}
      />

      <InputGroup
        label="Username"
        placeholder="johndoe"
        prefix="@"
        description="Choose a unique username."
      />

      <InputGroup
        label="Email"
        type="email"
        placeholder="you@example.com"
        prefix={<EmailIcon />}
      />
    </StorySurface>
  ),
};

export const WithSuffix: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <InputGroup
        label="Amount"
        type="number"
        placeholder="0.00"
        prefix={<DollarIcon />}
        suffix="USD"
      />

      <InputGroup
        label="Discount"
        type="number"
        placeholder="10"
        suffix={<PercentIcon />}
      />

      <InputGroup
        label="Website"
        type="text"
        placeholder="example"
        suffix=".com"
      />
    </StorySurface>
  ),
};

export const Both: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <InputGroup
        label="Price"
        type="number"
        placeholder="99.99"
        prefix="$"
        suffix="USD"
      />

      <InputGroup
        label="Width"
        type="number"
        placeholder="100"
        prefix="W:"
        suffix="px"
      />

      <InputGroup
        label="Weight"
        type="number"
        placeholder="70"
        prefix={<UserIcon />}
        suffix="kg"
      />
    </StorySurface>
  ),
};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <InputGroup
        size="sm"
        label="Small"
        placeholder="Small input"
        prefix={<SearchIcon />}
      />

      <InputGroup
        size="md"
        label="Medium"
        placeholder="Medium input"
        prefix={<SearchIcon />}
      />

      <InputGroup
        size="lg"
        label="Large"
        placeholder="Large input"
        prefix={<SearchIcon />}
      />
    </StorySurface>
  ),
};

export const Variants: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <InputGroup
        variant="default"
        label="Default"
        placeholder="Default variant"
        prefix={<SearchIcon />}
      />

      <InputGroup
        variant="filled"
        label="Filled"
        placeholder="Filled variant"
        prefix={<SearchIcon />}
      />

      <InputGroup
        variant="ghost"
        label="Ghost"
        placeholder="Ghost variant"
        prefix={<SearchIcon />}
      />
    </StorySurface>
  ),
};

export const WithError: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <InputGroup
        label="Email"
        type="email"
        placeholder="you@example.com"
        prefix={<EmailIcon />}
        error="Please enter a valid email address."
      />

      <InputGroup
        label="Amount"
        type="number"
        placeholder="0.00"
        prefix="$"
        error="Amount must be greater than 0."
      />

      <InputGroup
        label="Weight"
        type="number"
        placeholder="70"
        suffix="kg"
        error="Weight must be between 1 and 500."
      />
    </StorySurface>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <InputGroup
        label="Disabled with prefix"
        placeholder="Cannot edit"
        disabled
        prefix={<SearchIcon />}
      />

      <InputGroup
        label="Disabled with suffix"
        placeholder="0.00"
        disabled
        prefix="$"
        suffix="USD"
      />

      <InputGroup
        label="Disabled field"
        placeholder="Disabled input"
        disabled
        description="This field is disabled."
      />
    </StorySurface>
  ),
};

export const CompleteExample: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <InputGroup
        label="Product Price"
        type="number"
        placeholder="99.99"
        prefix="$"
        suffix="USD"
        description="Enter the price in US dollars."
      />

      <InputGroup
        label="Search"
        placeholder="Search products..."
        prefix={<SearchIcon />}
        description="Search by name, category, or SKU."
      />

      <InputGroup
        label="Website"
        type="url"
        placeholder="example"
        prefix="https://"
        suffix=".com"
      />

      <InputGroup
        label="Email"
        type="email"
        placeholder="you@example.com"
        prefix={<EmailIcon />}
      />

      <InputGroup
        label="Width"
        type="number"
        placeholder="100"
        prefix="W:"
        suffix="px"
      />

      <InputGroup
        label="Username"
        placeholder="johndoe"
        prefix="@"
        description="Your username will be visible to other users."
      />
    </StorySurface>
  ),
};
