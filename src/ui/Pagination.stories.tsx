import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  args: {
    page: 4,
    totalPages: 12,
    siblingCount: 1,
    onPageChange: () => {},
  },
  render: (args) => {
    const Example = () => {
      const [page, setPage] = useState(args.page);
      return (
        <StorySurface className="w-[420px]">
          <Pagination {...args} page={page} onPageChange={setPage} />
        </StorySurface>
      );
    };

    return <Example />;
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CompactRange: Story = {
  args: {
    page: 8,
    totalPages: 24,
    siblingCount: 0,
  },
};
