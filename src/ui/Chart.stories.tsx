import type { Meta, StoryObj } from "@storybook/react";
import {
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "./Chart";
import { StorySurface } from "./storybook-utils";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Line,
  Area,
  Pie,
} from "recharts";

const BAR_DATA = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 198 },
  { month: "Mar", revenue: 5000, orders: 278 },
  { month: "Apr", revenue: 2780, orders: 189 },
  { month: "May", revenue: 1890, orders: 148 },
  { month: "Jun", revenue: 2390, orders: 210 },
];

const LINE_DATA = [
  { month: "Jan", users: 400, sessions: 2400 },
  { month: "Feb", users: 300, sessions: 1800 },
  { month: "Mar", users: 520, sessions: 3100 },
  { month: "Apr", users: 780, sessions: 4600 },
  { month: "May", users: 690, sessions: 4100 },
  { month: "Jun", users: 820, sessions: 5200 },
];

const PIE_DATA = [
  { name: "Chrome", value: 400 },
  { name: "Firefox", value: 300 },
  { name: "Safari", value: 200 },
  { name: "Edge", value: 100 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "#4628F1" },
  orders: { label: "Orders", color: "#06B6D4" },
  users: { label: "Users", color: "#22C55E" },
  sessions: { label: "Sessions", color: "#F59E0B" },
  Chrome: { label: "Chrome", color: "#4628F1" },
  Firefox: { label: "Firefox", color: "#06B6D4" },
  Safari: { label: "Safari", color: "#22C55E" },
  Edge: { label: "Edge", color: "#F59E0B" },
};

function AxisProps() {
  return {
    tick: { fontSize: 12 },
    axisLine: false,
    tickLine: false,
  };
}

const meta = {
  title: "UI/Chart",
  component: BarChart,
  render: (_args) => (
    <StorySurface className="h-[400px] w-full max-w-none">
      <ChartContainer config={chartConfig}>
        <BarChart data={BAR_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" {...AxisProps()} />
          <YAxis {...AxisProps()} />
          <ChartTooltip />
          <ChartLegend />
          <Bar dataKey="revenue" fill="#4628F1" radius={4} />
          <Bar dataKey="orders" fill="#06B6D4" radius={4} />
        </BarChart>
      </ChartContainer>
    </StorySurface>
  ),
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BarChartStory: Story = {
  name: "Bar Chart",
  render: () => (
    <StorySurface className="h-[400px] w-full max-w-none">
      <ChartContainer config={chartConfig}>
        <BarChart data={BAR_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" {...AxisProps()} />
          <YAxis {...AxisProps()} />
          <ChartTooltip />
          <ChartLegend />
          <Bar dataKey="revenue" fill="#4628F1" radius={4} />
          <Bar dataKey="orders" fill="#06B6D4" radius={4} />
        </BarChart>
      </ChartContainer>
    </StorySurface>
  ),
};

export const LineChartStory: Story = {
  name: "Line Chart",
  render: () => (
    <StorySurface className="h-[400px] w-full max-w-none">
      <ChartContainer config={chartConfig}>
        <LineChart data={LINE_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" {...AxisProps()} />
          <YAxis {...AxisProps()} />
          <ChartTooltip />
          <ChartLegend />
          <Line type="monotone" dataKey="users" stroke="#22C55E" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sessions" stroke="#F59E0B" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </StorySurface>
  ),
};

export const AreaChartStory: Story = {
  name: "Area Chart",
  render: () => (
    <StorySurface className="h-[400px] w-full max-w-none">
      <ChartContainer config={chartConfig}>
        <AreaChart data={LINE_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" {...AxisProps()} />
          <YAxis {...AxisProps()} />
          <ChartTooltip />
          <ChartLegend />
          <Area type="monotone" dataKey="users" fill="#22C55E" fillOpacity={0.2} stroke="#22C55E" strokeWidth={2} />
          <Area type="monotone" dataKey="sessions" fill="#F59E0B" fillOpacity={0.2} stroke="#F59E0B" strokeWidth={2} />
        </AreaChart>
      </ChartContainer>
    </StorySurface>
  ),
};

export const PieChartStory: Story = {
  name: "Pie Chart",
  render: () => (
    <StorySurface className="h-[400px] w-full max-w-none">
      <ChartContainer config={chartConfig}>
        <PieChart>
          <ChartTooltip />
          <ChartLegend />
          <Pie
            data={PIE_DATA}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          />
        </PieChart>
      </ChartContainer>
    </StorySurface>
  ),
};
