import type { Meta, StoryObj } from "@storybook/react";
import { Carousel } from "./Carousel";
import { StorySurface } from "./storybook-utils";

const ITEMS = [
  { label: "Slide 1", color: "bg-primary/10" },
  { label: "Slide 2", color: "bg-blue-100 dark:bg-blue-900/30" },
  { label: "Slide 3", color: "bg-green-100 dark:bg-green-900/30" },
  { label: "Slide 4", color: "bg-amber-100 dark:bg-amber-900/30" },
  { label: "Slide 5", color: "bg-purple-100 dark:bg-purple-900/30" },
];

function CarouselSlides({ count = 5 }: { count?: number }) {
  return Array.from({ length: count }, (_, i) => (
    <Carousel.Item key={i}>
      <div
        className={`flex h-48 items-center justify-center rounded-lg ${ITEMS[i % ITEMS.length]?.color ?? ""}`}
      >
        <span className="text-xl font-bold text-slate-700 dark:text-slate-300">
          {ITEMS[i % ITEMS.length]?.label ?? `Slide ${i + 1}`}
        </span>
      </div>
    </Carousel.Item>
  ));
}

function CarouselTemplate(args: React.ComponentProps<typeof Carousel>) {
  const isVertical = args.orientation === "vertical";
  return (
    <StorySurface padded={false} className={isVertical ? "w-[300px]" : "max-w-md w-full"}>
      <Carousel {...args} className={isVertical ? "h-[400px]" : "w-full"}>
        <Carousel.Content>
          <CarouselSlides />
        </Carousel.Content>
        <Carousel.Previous />
        <Carousel.Next />
      </Carousel>
    </StorySurface>
  );
}

const meta = {
  title: "UI/Carousel",
  component: Carousel,
  args: {
    children: null,
  },
  render: CarouselTemplate,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLoop: Story = {
  args: {
    children: null,
    opts: { loop: true },
  },
};

export const Vertical: Story = {
  args: {
    children: null,
    orientation: "vertical",
  },
};

export const ManyItems: Story = {
  render: () => (
    <StorySurface padded={false} className="max-w-md w-full">
      <Carousel opts={{ loop: true }} className="w-full">
        <Carousel.Content>
          <CarouselSlides count={10} />
        </Carousel.Content>
        <Carousel.Previous />
        <Carousel.Next />
      </Carousel>
    </StorySurface>
  ),
};
