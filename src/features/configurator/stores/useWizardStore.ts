"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PresetConfig, RadiusOption, FrameworkOption } from "../data";

interface WizardState {
  // Current step
  currentStep: "visual" | "stack" | "generate";
  setCurrentStep: (step: "visual" | "stack" | "generate") => void;

  // Visual preset state
  style: PresetConfig["style"];
  setStyle: (style: PresetConfig["style"]) => void;

  colors: PresetConfig["colors"];
  setColors: (colors: PresetConfig["colors"]) => void;

  fonts: PresetConfig["fonts"];
  setFonts: (fonts: PresetConfig["fonts"]) => void;

  iconSet: string;
  setIconSet: (iconSet: string) => void;

  radius: RadiusOption;
  setRadius: (radius: RadiusOption) => void;

  components: string[];
  setComponents: (components: string[]) => void;
  toggleComponent: (component: string) => void;

  // Stack state
  framework: FrameworkOption;
  setFramework: (framework: FrameworkOption) => void;

  stateManagement: boolean;
  toggleStateManagement: () => void;

  dataFetching: boolean;
  toggleDataFetching: () => void;

  forms: boolean;
  toggleForms: () => void;

  monorepo: boolean;
  toggleMonorepo: () => void;

  rtl: boolean;
  toggleRtl: () => void;

  // Get complete PresetConfig
  getPresetConfig: () => PresetConfig;

  // Reset
  resetVisual: () => void;
  resetStack: () => void;
  resetAll: () => void;
}

const defaultState = {
  style: "arc" as const,
  colors: {
    base: "#0f172a",
    brand: "#3b82f6",
    accent: "#8b5cf6",
    chart: "#10b981",
  },
  fonts: {
    header: "Inter",
    body: "Inter",
  },
  iconSet: "material-symbols",
  radius: "md" as const,
  components: [],
  framework: "nextjs" as const,
  stateManagement: true,
  dataFetching: true,
  forms: true,
  monorepo: false,
  rtl: false,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...defaultState,
      currentStep: "visual",

      // Step navigation
      setCurrentStep: (step) => set({ currentStep: step }),

      // Visual preset setters
      setStyle: (style) => set({ style }),
      setColors: (colors) => set({ colors }),
      setFonts: (fonts) => set({ fonts }),
      setIconSet: (iconSet) => set({ iconSet }),
      setRadius: (radius) => set({ radius }),

      setComponents: (components) => set({ components }),
      toggleComponent: (component) =>
        set((state) => ({
          components: state.components.includes(component)
            ? state.components.filter((c) => c !== component)
            : [...state.components, component],
        })),

      // Stack setters
      setFramework: (framework) => set({ framework }),

      toggleStateManagement: () =>
        set((state) => ({ stateManagement: !state.stateManagement })),

      toggleDataFetching: () =>
        set((state) => ({ dataFetching: !state.dataFetching })),

      toggleForms: () => set((state) => ({ forms: !state.forms })),

      toggleMonorepo: () =>
        set((state) => ({ monorepo: !state.monorepo })),

      toggleRtl: () => set((state) => ({ rtl: !state.rtl })),

      // Get complete PresetConfig
      getPresetConfig: () => {
        const state = get();
        return {
          style: state.style,
          colors: state.colors,
          fonts: state.fonts,
          iconSet: state.iconSet,
          radius: state.radius,
          components: state.components,
          stack: {
            framework: state.framework,
            stateManagement: state.stateManagement,
            dataFetching: state.dataFetching,
            forms: state.forms,
            monorepo: state.monorepo,
            rtl: state.rtl,
          },
          version: 1,
        };
      },

      // Reset functions
      resetVisual: () =>
        set({
          style: defaultState.style,
          colors: defaultState.colors,
          fonts: defaultState.fonts,
          iconSet: defaultState.iconSet,
          radius: defaultState.radius,
          components: defaultState.components,
        }),

      resetStack: () =>
        set({
          framework: defaultState.framework,
          stateManagement: defaultState.stateManagement,
          dataFetching: defaultState.dataFetching,
          forms: defaultState.forms,
          monorepo: defaultState.monorepo,
          rtl: defaultState.rtl,
        }),

      resetAll: () => set(defaultState),
    }),
    {
      name: "wizard-storage",
    }
  )
);
