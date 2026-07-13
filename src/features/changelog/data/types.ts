/** Category of a single change within a changelog entry. */
export type ChangeType = "added" | "changed" | "fixed";

export interface ChangelogChange {
  /** Category tag used for grouping and the colored badge. */
  type: ChangeType;
  /** Human-readable description of the change. */
  text: string;
  /** Optional link to the PR, recipe, or surface the change affects. */
  href?: string;
}

export interface ChangelogEntry {
  /** Optional semver-style version label (e.g. "1.1.0"). */
  version?: string;
  /** Release date in ISO format (YYYY-MM-DD). */
  date: string;
  /** Short, headline-style title for the release. */
  title: string;
  /** One or two sentences framing what shipped and why it matters. */
  summary: string;
  /** The individual changes, tagged by category. */
  items: ChangelogChange[];
}
