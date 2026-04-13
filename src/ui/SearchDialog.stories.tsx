import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { SearchDialog } from "./SearchDialog";
import { SEARCH_ITEMS, StatefulWrapper, StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/SearchDialog",
  component: SearchDialog,
  args: {
    open: false,
    items: SEARCH_ITEMS,
    onClose: () => {},
    onNavigate: () => {},
    savedSlugs: [],
  },
  render: () => (
    <StatefulWrapper initial>
      {(open, setOpen) => (
        <StorySurface>
          <Button onClick={() => setOpen(true)}>Open search</Button>
          <SearchDialog
            open={open}
            items={SEARCH_ITEMS}
            savedSlugs={["form-validation"]}
            onClose={() => setOpen(false)}
            onNavigate={() => setOpen(false)}
          />
        </StorySurface>
      )}
    </StatefulWrapper>
  ),
} satisfies Meta<typeof SearchDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
