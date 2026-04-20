import type { Meta, StoryObj } from "@storybook/react";
import { Field } from "./Field";
import { StorySurface } from "./storybook-utils";
import { Input } from "./Input";
import { Checkbox } from "./Checkbox";
import { Select } from "./Select";
import { Textarea } from "./Textarea";

const meta = {
  title: "UI/Field",
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email address",
    helperText: "We'll never share your email with anyone else.",
    children: <Input placeholder="you@example.com" />,
  },
  render: (args) => (
    <StorySurface className="w-[420px]">
      <Field {...args}>
        <Input placeholder="you@example.com" />
      </Field>
    </StorySurface>
  ),
};

export const WithHelperText: Story = {
  args: { children: <div /> },
  render: () => (
    <StorySurface className="w-[420px]">
      <Field
        label="Password"
        helperText="Must be at least 8 characters long."
      >
        <Input type="password" placeholder="Enter password" />
      </Field>
    </StorySurface>
  ),
};

export const WithError: Story = {
  args: { children: <div /> },
  render: () => (
    <StorySurface className="w-[420px]">
      <Field
        label="Username"
        errorMessage="Username is already taken."
      >
        <Input placeholder="Choose a username" />
      </Field>
    </StorySurface>
  ),
};

export const Required: Story = {
  args: { children: <div /> },
  render: () => (
    <StorySurface className="w-[420px]">
      <Field
        label="Full name"
        required
        helperText="Enter your legal name."
      >
        <Input placeholder="John Doe" />
      </Field>
    </StorySurface>
  ),
};

export const Disabled: Story = {
  args: { children: <div /> },
  render: () => (
    <StorySurface className="w-[420px]">
      <Field
        label="Email address"
        disabled
        helperText="This field is disabled."
      >
        <Input placeholder="you@example.com" disabled />
      </Field>
    </StorySurface>
  ),
};

export const WithSelect: Story = {
  args: { children: <div /> },
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <Field
        label="Country"
        helperText="Select your country of residence."
        required
      >
        <Select
          options={[
            { label: "United States", value: "us" },
            { label: "Canada", value: "ca" },
            { label: "United Kingdom", value: "uk" },
          ]}
        />
      </Field>
      <Field
        label="Role"
        errorMessage="This field is required."
      >
        <Select
          options={[
            { label: "Administrator", value: "admin" },
            { label: "User", value: "user" },
            { label: "Guest", value: "guest" },
          ]}
          placeholder="Select a role"
        />
      </Field>
    </StorySurface>
  ),
};

export const WithTextarea: Story = {
  args: { children: <div /> },
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <Field
        label="Bio"
        helperText="Tell us a bit about yourself."
      >
        <Textarea placeholder="Write something..." rows={4} />
      </Field>
      <Field
        label="Feedback"
        errorMessage="This field must be at least 50 characters."
      >
        <Textarea
          placeholder="Please provide detailed feedback..."
          rows={4}
        />
      </Field>
    </StorySurface>
  ),
};

export const FormExample: Story = {
  args: { children: <div /> },
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <Field
        label="Email address"
        helperText="We'll never share your email."
        required
      >
        <Input type="email" placeholder="you@example.com" />
      </Field>

      <Field
        label="Password"
        helperText="Must be at least 8 characters."
        required
      >
        <Input type="password" placeholder="Enter password" />
      </Field>

      <Field
        label="Role"
        helperText="Select your account role."
        required
      >
        <Select
          options={[
            { label: "Administrator", value: "admin" },
            { label: "User", value: "user" },
          ]}
        />
      </Field>

      <Field
        label="Bio"
        helperText="Optional: Tell us about yourself."
      >
        <Textarea placeholder="Write something..." rows={3} />
      </Field>

    </StorySurface>
  ),
};
