import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "react-principles Storybook",
    brandUrl: "https://reactprinciples.dev",
    brandTarget: "_self",
    colorPrimary: "#4628f1",
    colorSecondary: "#4628f1",
    appBg: "#f6f6f8",
    appContentBg: "#ffffff",
    appBorderColor: "#e2e8f0",
    appBorderRadius: 12,
  }),
});
