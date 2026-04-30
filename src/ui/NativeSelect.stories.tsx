import type { Meta, StoryObj } from "@storybook/react";
import { NativeSelect } from "./NativeSelect";
import { StorySurface } from "./storybook-utils";
import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const SAMPLE_OPTIONS = [
  { label: "Design System", value: "design-system" },
  { label: "Cookbook", value: "cookbook" },
  { label: "CLI", value: "cli" },
  { label: "Playground", value: "playground" },
];

const FRUIT_OPTIONS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Mango", value: "mango" },
  { label: "Grape", value: "grape", disabled: true },
];

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/NativeSelect",
  component: NativeSelect,
  args: {
    label: "Select an option",
    options: SAMPLE_OPTIONS,
  },
  render: (args) => (
    <StorySurface className="w-[420px] space-y-4">
      <NativeSelect {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <NativeSelect
        label="Small"
        size="sm"
        options={SAMPLE_OPTIONS}
        placeholder="Choose size..."
      />

      <NativeSelect
        label="Medium"
        size="md"
        options={SAMPLE_OPTIONS}
        placeholder="Choose size..."
      />

      <NativeSelect
        label="Large"
        size="lg"
        options={SAMPLE_OPTIONS}
        placeholder="Choose size..."
      />
    </StorySurface>
  ),
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Select a feature...",
    options: SAMPLE_OPTIONS,
  },
};

export const WithError: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <NativeSelect
        label="Favorite Fruit"
        options={FRUIT_OPTIONS}
        error="Please select a fruit."
      />

      <NativeSelect
        label="Country"
        options={SAMPLE_OPTIONS}
        error="This field is required."
      />
    </StorySurface>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <NativeSelect
        label="Disabled Select"
        options={SAMPLE_OPTIONS}
        disabled
      />

      <NativeSelect
        label="Disabled with Value"
        options={SAMPLE_OPTIONS}
        value="cookbook"
        disabled
        description="This field is disabled."
      />
    </StorySurface>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <NativeSelect label="Choose a Fruit">
        <option value="">Select a fruit...</option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
        <option value="mango">Mango</option>
      </NativeSelect>

      <NativeSelect label="Choose a Size">
        <option value="sm">Small</option>
        <option value="md">Medium</option>
        <option value="lg">Large</option>
        <option value="xl">Extra Large</option>
      </NativeSelect>
    </StorySurface>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState("design-system");

  return (
    <StorySurface className="w-[420px] space-y-4">
      <NativeSelect
        label="Controlled Select"
        options={SAMPLE_OPTIONS}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        description="Selected value: {value}"
      />

      <div className="p-3 bg-slate-50 dark:bg-[#161b22] rounded-lg border border-slate-200 dark:border-[#1f2937]">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Selected value: <code className="font-mono text-primary">{value || "(none)"}</code>
        </p>
      </div>
    </StorySurface>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

function CompleteExampleComponent() {
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("md");
  const [fruit, setFruit] = useState("");

  return (
    <StorySurface className="w-[420px] space-y-4">
      <NativeSelect
        label="Category"
        placeholder="Select a category..."
        options={SAMPLE_OPTIONS}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        description="Choose the feature category"
      />

      <NativeSelect
        label="Size"
        options={[
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ]}
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />

      <NativeSelect
        label="Favorite Fruit"
        placeholder="Pick your favorite..."
        options={FRUIT_OPTIONS}
        value={fruit}
        onChange={(e) => setFruit(e.target.value)}
      />

      <div className="p-3 bg-slate-50 dark:bg-[#161b22] rounded-lg border border-slate-200 dark:border-[#1f2937]">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Category: <code className="font-mono">{category || "(none)"}</code>
          <br />
          Size: <code className="font-mono">{size}</code>
          <br />
          Fruit: <code className="font-mono">{fruit || "(none)"}</code>
        </p>
      </div>
    </StorySurface>
  );
}

export const CompleteExample: Story = {
  render: () => <CompleteExampleComponent />,
};
