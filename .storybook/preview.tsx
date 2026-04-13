import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "@/app/globals.css";
import "@material-symbols/font-400/outlined.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    layout: "centered",
    backgrounds: {
      disable: true,
    },
    docs: {
      codePanel: true,
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [
    withThemeByClassName({
      defaultTheme: "light",
      themes: {
        light: "",
        dark: "dark",
      },
    }),
    (Story, context) =>
      context.viewMode === "docs" ? (
        <Story />
      ) : (
        <div className="min-h-screen w-full bg-(--background) text-(--foreground) p-6">
          <Story />
        </div>
      ),
  ],
  tags: ["autodocs"],
};

export default preview;
