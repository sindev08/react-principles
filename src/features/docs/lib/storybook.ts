const STORYBOOK_BASE_URL = "https://storybook.reactprinciples.dev";

const STORYBOOK_TITLE_SEGMENT_BY_COMPONENT: Record<string, string> = {
  "alert-dialog": "alertdialog",
  "date-picker": "datepicker",
  "dropdown-menu": "dropdownmenu",
  "radio-group": "radiogroup",
};

const STORYBOOK_STORY_SEGMENT_BY_COMPONENT: Record<string, string> = {
  "alert-dialog": "destructive",
  separator: "horizontal",
  tabs: "underline",
  tooltip: "top",
};

function getStorybookStoryId(componentSlug: string) {
  const titleSegment = STORYBOOK_TITLE_SEGMENT_BY_COMPONENT[componentSlug] ?? componentSlug;
  const storySegment = STORYBOOK_STORY_SEGMENT_BY_COMPONENT[componentSlug] ?? "default";

  return `ui-${titleSegment}--${storySegment}`;
}

export function getStorybookComponentUrl(componentSlug: string) {
  return `${STORYBOOK_BASE_URL}/?path=/story/${getStorybookStoryId(componentSlug)}`;
}

export function getStorybookEmbedUrl(componentSlug: string) {
  return `${STORYBOOK_BASE_URL}/iframe.html?id=${getStorybookStoryId(componentSlug)}&viewMode=story`;
}

export { STORYBOOK_BASE_URL };
