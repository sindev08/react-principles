import type { Meta, StoryObj } from "@storybook/react";
import { AspectRatio } from "./AspectRatio";
import { StorySurface } from "./storybook-utils";

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/AspectRatio",
  component: AspectRatio,
  args: {
    ratio: 16 / 9,
    children: <div className="w-full h-full bg-slate-200 dark:bg-[#1f2937]" />,
  },
  render: (args) => (
    <StorySurface className="w-[600px] space-y-6">
      <AspectRatio {...args} />
    </StorySurface>
  ),
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CommonRatios: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">16:9 - Widescreen</h3>
        <div className="w-full">
          <AspectRatio ratio={16 / 9}>
            <img
              src="https://picsum.photos/800/450?random=10"
              alt="16:9 landscape"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">4:3 - Standard TV</h3>
        <div className="w-full">
          <AspectRatio ratio={4 / 3}>
            <img
              src="https://picsum.photos/800/600?random=11"
              alt="4:3 landscape"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">1:1 - Square</h3>
        <div className="w-full">
          <AspectRatio ratio={1}>
            <img
              src="https://picsum.photos/600/600?random=12"
              alt="1:1 square"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">21:9 - Ultrawide</h3>
        <div className="w-full">
          <AspectRatio ratio="21/9">
            <img
              src="https://picsum.photos/800/343?random=13"
              alt="21:9 ultrawide"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
      </div>
    </StorySurface>
  ),
};

export const Responsive: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Responsive Widths</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Full width</p>
            <AspectRatio ratio={16 / 9}>
              <img
                src="https://picsum.photos/800/450?random=20"
                alt="Full width"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Half width</p>
            <div className="w-1/2">
              <AspectRatio ratio={16 / 9}>
                <img
                  src="https://picsum.photos/800/450?random=21"
                  alt="Half width"
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Third width</p>
            <div className="w-1/3">
              <AspectRatio ratio={16 / 9}>
                <img
                  src="https://picsum.photos/800/450?random=22"
                  alt="Third width"
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Grid Layout</h3>
        <div className="grid grid-cols-2 gap-4">
          <AspectRatio ratio={1}>
            <img
              src="https://picsum.photos/400/400?random=30"
              alt="Grid item 1"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <AspectRatio ratio={1}>
            <img
              src="https://picsum.photos/400/400?random=31"
              alt="Grid item 2"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <AspectRatio ratio={1}>
            <img
              src="https://picsum.photos/400/400?random=32"
              alt="Grid item 3"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          <AspectRatio ratio={1}>
            <img
              src="https://picsum.photos/400/400?random=33"
              alt="Grid item 4"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
      </div>
    </StorySurface>
  ),
};

export const WithContent: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Video Container</h3>
        <AspectRatio ratio={16 / 9}>
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </AspectRatio>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">With Overlay Content</h3>
        <AspectRatio ratio={16 / 9}>
          <img
            src="https://picsum.photos/800/450?random=40"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 bg-black/50">
            <h2 className="text-2xl font-bold text-white text-center">Hero Title</h2>
            <p className="text-white/80 text-center mt-2">Subtitle or description goes here</p>
          </div>
        </AspectRatio>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Map Embed</h3>
        <AspectRatio ratio={16 / 9}>
          <iframe
            className="w-full h-full"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-0.0040,51.5061,-0.0960,51.5160&layer=mapnik&marker=51.5074,-0.0451"
            title="Map"
            frameBorder="0"
          />
        </AspectRatio>
      </div>
    </StorySurface>
  ),
};

export const RatioFormats: Story = {
  render: () => (
    <StorySurface className="w-[600px] space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Number Format (Decimal)</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AspectRatio ratio={1.778} className="w-32">
              <img
                src="https://picsum.photos/200/112?random=50"
                alt="16:9 decimal"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <span className="text-xs text-slate-600 dark:text-slate-400">1.778 (16:9)</span>
          </div>
          <div className="flex items-center gap-2">
            <AspectRatio ratio={1.333} className="w-32">
              <img
                src="https://picsum.photos/200/150?random=51"
                alt="4:3 decimal"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <span className="text-xs text-slate-600 dark:text-slate-400">1.333 (4:3)</span>
          </div>
          <div className="flex items-center gap-2">
            <AspectRatio ratio={1} className="w-32">
              <img
                src="https://picsum.photos/200/200?random=52"
                alt="1:1 decimal"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <span className="text-xs text-slate-600 dark:text-slate-400">1.0 (1:1)</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">String Format (Fraction)</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AspectRatio ratio="16/9" className="w-32">
              <img
                src="https://picsum.photos/200/112?random=60"
                alt="16:9 string"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <span className="text-xs text-slate-600 dark:text-slate-400">"16/9"</span>
          </div>
          <div className="flex items-center gap-2">
            <AspectRatio ratio="4/3" className="w-32">
              <img
                src="https://picsum.photos/200/150?random=61"
                alt="4:3 string"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <span className="text-xs text-slate-600 dark:text-slate-400">"4/3"</span>
          </div>
          <div className="flex items-center gap-2">
            <AspectRatio ratio="21/9" className="w-32">
              <img
                src="https://picsum.photos/200/86?random=62"
                alt="21:9 string"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <span className="text-xs text-slate-600 dark:text-slate-400">"21/9"</span>
          </div>
        </div>
      </div>
    </StorySurface>
  ),
};

export const CompleteExample: Story = {
  render: () => {
    const images = [
      "https://picsum.photos/400/400?random=70",
      "https://picsum.photos/400/400?random=71",
      "https://picsum.photos/400/400?random=72",
      "https://picsum.photos/400/400?random=73",
    ];

    return (
      <StorySurface className="w-[600px] space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Photo Gallery</h3>
          <div className="grid grid-cols-2 gap-4">
            {images.map((src, i) => (
              <AspectRatio key={i} ratio={1}>
                <img
                  src={src}
                  alt={`Gallery photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Video Thumbnails</h3>
          <div className="space-y-3">
            <div className="flex gap-4">
              <AspectRatio ratio={16 / 9} className="flex-1">
                <img
                  src="https://picsum.photos/400/225?random=80"
                  alt="Video 1"
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              <div className="flex flex-col flex-1 gap-2">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Video Title 1</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Description of the video content</p>
              </div>
            </div>

            <div className="flex gap-4">
              <AspectRatio ratio={16 / 9} className="flex-1">
                <img
                  src="https://picsum.photos/400/225?random=81"
                  alt="Video 2"
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              <div className="flex flex-col flex-1 gap-2">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Video Title 2</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Description of the video content</p>
              </div>
            </div>
          </div>
        </div>
      </StorySurface>
    );
  },
};
