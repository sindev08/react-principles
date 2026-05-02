import type { Meta, StoryObj } from "@storybook/react";
import { Table } from "./Table";
import { StorySurface } from "./storybook-utils";

const meta = {
  title: "UI/Table",
  component: Table,
  args: {},
  render: (args) => (
    <StorySurface padded={false}>
      <Table {...args}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Invoice</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Method</Table.Head>
            <Table.Head className="text-right">Amount</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="font-medium">INV001</Table.Cell>
            <Table.Cell>Paid</Table.Cell>
            <Table.Cell>Credit Card</Table.Cell>
            <Table.Cell className="text-right">$250.00</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="font-medium">INV002</Table.Cell>
            <Table.Cell>Pending</Table.Cell>
            <Table.Cell>Bank Transfer</Table.Cell>
            <Table.Cell className="text-right">$150.00</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="font-medium">INV003</Table.Cell>
            <Table.Cell>Unpaid</Table.Cell>
            <Table.Cell>PayPal</Table.Cell>
            <Table.Cell className="text-right">$350.00</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </StorySurface>
  ),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithFooter: Story = {
  render: () => (
    <StorySurface padded={false}>
      <Table>
        <Table.Caption>March 2024</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Invoice</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head className="text-right">Amount</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="font-medium">INV001</Table.Cell>
            <Table.Cell>Paid</Table.Cell>
            <Table.Cell className="text-right">$250.00</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="font-medium">INV002</Table.Cell>
            <Table.Cell>Paid</Table.Cell>
            <Table.Cell className="text-right">$150.00</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell className="font-medium">Total</Table.Cell>
            <Table.Cell />
            <Table.Cell className="text-right">$400.00</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </StorySurface>
  ),
};

export const Dense: Story = {
  render: () => (
    <StorySurface padded={false}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head className="py-2">Name</Table.Head>
            <Table.Head className="py-2">Email</Table.Head>
            <Table.Head className="py-2">Role</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {[
            { name: "Alice", email: "alice@example.com", role: "Admin" },
            { name: "Bob", email: "bob@example.com", role: "User" },
            { name: "Charlie", email: "charlie@example.com", role: "User" },
          ].map((user) => (
            <Table.Row key={user.name}>
              <Table.Cell className="py-2">{user.name}</Table.Cell>
              <Table.Cell className="py-2">{user.email}</Table.Cell>
              <Table.Cell className="py-2">{user.role}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </StorySurface>
  ),
};
