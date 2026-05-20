import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./Typography";
import { StorySurface } from "./storybook-utils";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/Typography",
  component: Typography,
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Headings: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-4">
      <Typography variant="h1">Heading 1 - Page Title</Typography>
      <Typography variant="h2">Heading 2 - Section Title</Typography>
      <Typography variant="h3">Heading 3 - Subsection Title</Typography>
      <Typography variant="h4">Heading 4 - Component Title</Typography>
    </StorySurface>
  ),
};

export const BodyText: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-4">
      <Typography variant="p">
        This is body text. It uses a comfortable reading size with proper line height for long-form content.
        The text color provides good contrast in both light and dark modes.
      </Typography>

      <Typography variant="lead">
        This is a lead paragraph. It's larger than body text and perfect for introductory content or
        opening statements that need to grab attention.
      </Typography>

      <Typography variant="muted">
        This is muted text. It's styled with a lighter color for secondary information or metadata
        that shouldn't compete with primary content.
      </Typography>

      <Typography variant="small">
        This is small text. Use it for fine print, legal disclaimers, copyright notices, or any
        content that needs to be present but not prominent.
      </Typography>
    </StorySurface>
  ),
};

export const BlockElements: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-6">
      <Typography variant="blockquote">
        "The details of typography as a craft are often ignored or underestimated by developers.
        Good typography creates a visual hierarchy and helps users navigate content easily."
      </Typography>

      <Typography variant="list">
        <li>First item with important information</li>
        <li>Second item with additional details</li>
        <li>Third item with concluding remarks</li>
      </Typography>

      <Typography variant="list" as="ol" className="list-decimal">
        <li>First step in the process</li>
        <li>Second step to follow</li>
        <li>Third step to complete</li>
      </Typography>
    </StorySurface>
  ),
};

export const InlineCode: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-4">
      <Typography variant="p">
        You can use inline code like <Typography variant="code">const foo = "bar";</Typography> within
        body text to highlight technical terms or code snippets.
      </Typography>

      <Typography variant="p">
        The code variant uses a monospace font with a subtle background color to distinguish it
        from surrounding text. It's perfect for <Typography variant="code">functionName()</Typography>{" "}
        or <Typography variant="code">variableName</Typography> examples.
      </Typography>
    </StorySurface>
  ),
};

export const AsPropOverride: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-4">
      <Typography variant="h1" as="h2">
        This is semantically an h2 but styled as h1
      </Typography>

      <Typography variant="p" as="div">
        This is a div with paragraph styling
      </Typography>

      <Typography variant="list" as="ol" className="list-decimal">
        <li>Ordered list item using as prop</li>
        <li>Second item</li>
        <li>Third item</li>
      </Typography>
    </StorySurface>
  ),
};

export const CompleteExample: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-6">
      <Typography variant="h1">Typography Component</Typography>

      <Typography variant="lead">
        A unified typography system for consistent text styling across your application.
        Provides semantic HTML elements with the flexibility to override when needed.
      </Typography>

      <Typography variant="h2">Features</Typography>

      <Typography variant="list">
        <li>Semantic HTML elements by default</li>
        <li>Consistent sizing and spacing</li>
        <li>Dark mode support out of the box</li>
        <li>Flexible element override via as prop</li>
      </Typography>

      <Typography variant="h2">Usage</Typography>

      <Typography variant="p">
        Use the Typography component for all text content. It ensures consistent styling
        and proper semantic structure throughout your application.
      </Typography>

      <Typography variant="blockquote">
        "Good typography is invisible—it lets the content shine without drawing attention
        to itself."
      </Typography>

      <Typography variant="h3">Code Examples</Typography>

      <Typography variant="p">
        You can include inline code like <Typography variant="code">Typography</Typography> to
        highlight technical terms.
      </Typography>

      <Typography variant="muted">
        Last updated: Just now
      </Typography>
    </StorySurface>
  ),
};
