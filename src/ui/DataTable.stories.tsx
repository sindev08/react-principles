import type { Meta, StoryObj } from "@storybook/react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { StorySurface } from "./storybook-utils";

interface Payment {
  id: string;
  name: string;
  status: string;
  amount: string;
}

const data: Payment[] = [
  { id: "INV001", name: "Alice Johnson", status: "Paid", amount: "$250.00" },
  { id: "INV002", name: "Bob Smith", status: "Pending", amount: "$150.00" },
  { id: "INV003", name: "Charlie Brown", status: "Unpaid", amount: "$350.00" },
  { id: "INV004", name: "Diana Prince", status: "Paid", amount: "$450.00" },
  { id: "INV005", name: "Edward Norton", status: "Pending", amount: "$120.00" },
  { id: "INV006", name: "Fiona Apple", status: "Paid", amount: "$280.00" },
  { id: "INV007", name: "George Lucas", status: "Unpaid", amount: "$500.00" },
  { id: "INV008", name: "Hannah Montana", status: "Paid", amount: "$90.00" },
];

const columns: Array<ColumnDef<Payment>> = [
  { accessorKey: "id", header: "Invoice" },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue<string>();
      const cls =
        status === "Paid"
          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
          : status === "Pending"
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
      return (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
          {status}
        </span>
      );
    },
  },
  { accessorKey: "amount", header: "Amount" },
];

const meta = {
  title: "UI/DataTable",
  component: DataTable,
  args: {
    columns,
    data,
    pageSize: 5,
  },
  render: (args) => (
    <StorySurface padded={false}>
      <DataTable {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof DataTable<Payment>>;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithLoading: Story = {
  args: {
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};

export const WithCustomEmptyState: Story = {
  args: {
    data: [],
    emptyState: (
      <div className="flex flex-col items-center gap-2 py-8">
        <span className="material-symbols-outlined text-[32px] text-slate-300 dark:text-slate-600">
          inbox
        </span>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          No invoices found
        </p>
      </div>
    ),
  },
};
