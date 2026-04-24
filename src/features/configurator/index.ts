/**
 * Configurator feature exports
 */
export type {
  PresetConfig,
  PresetColors,
  PresetFonts,
  PresetStack,
  StylePreset,
  RadiusOption,
  FrameworkOption,
  ValidatedPresetConfig,
} from "./data";

export {
  presetConfigSchema,
  presetColorsSchema,
  presetFontsSchema,
  presetStackSchema,
  DEFAULT_PRESET,
  PRESET_SCHEMA_VERSION,
} from "./data";

export { encodePreset, decodePreset } from "./lib";

export {
  getStyleProperties,
  applyStyleProperties,
  stylePropertiesToCSS,
  arcStyle,
  edgeStyle,
  soleilStyle,
  type StyleProperties,
  type StyleSystemPreset,
} from "./lib";

export {
  fetchGoogleFonts,
  getCuratedFonts,
  getPopularFonts,
  generateGoogleFontsURL,
  loadGoogleFonts,
  applyFontToCSS,
  sanitizeFontFamily,
  type GoogleFont,
  type GoogleFontsResponse,
} from "./lib";

export {
  getAllIconSets,
  getIconSetByPrefix,
  isValidIconSet,
  getDefaultIconSet,
  getSampleIcons,
  POPULAR_ICON_SETS,
  SAMPLE_ICONS,
  type IconifyCollection,
} from "./lib";

export {
  COMPONENT_DEPENDENCIES,
  STACK_DEPENDENCIES,
  getComponentDependencies,
  getStackDependencies,
  getAllDependencies,
  packagesToInstallString,
  type PackageEntry,
} from "./data";
