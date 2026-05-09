"use client";

import Link from "next/link";
import { Button } from "@/ui/Button";
import { Checkbox } from "@/ui/Checkbox";
import { Select } from "@/ui/Select";
import { Tabs } from "@/ui/Tabs";

const FRAMEWORK_OPTIONS = [
  { label: "Next.js", value: "nextjs" },
  { label: "Vite", value: "vitejs" },
  { label: "Storybook", value: "storybook" },
];

const COMPONENT_SHOWCASES = [
  {
    name: "Button",
    story: "Variants",
    description: "High-signal actions with strong defaults for primary, outline, ghost, and destructive flows.",
    href: "/docs/button",
    props: ['variant="primary"', 'size="md"', "isLoading"],
    preview: (
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    ),
  },
  {
    name: "Select",
    story: "Default",
    description: "Form choices keep labels, descriptions, and validation feedback aligned in one primitive.",
    href: "/docs/select",
    props: ['label="Framework"', 'placeholder="Choose stack"', 'size="md"'],
    preview: (
      <Select
        label="Framework"
        description="Storybook-backed preview configuration."
        placeholder="Choose stack"
        options={FRAMEWORK_OPTIONS}
        defaultValue="nextjs"
      />
    ),
  },
  {
    name: "Checkbox",
    story: "States",
    description: "Selection controls cover checked, indeterminate, and descriptive states without extra wrappers.",
    href: "/docs/checkbox",
    props: ['size="md"', "indeterminate", "description"],
    preview: (
      <div className="space-y-3">
        <Checkbox
          defaultChecked
          label="Ship docs examples"
          description="Ready to publish in docs and Storybook."
        />
        <Checkbox
          indeterminate
          label="Review variants"
          description="A partial selection state from the stories."
        />
      </div>
    ),
  },
  {
    name: "Tabs",
    story: "Pills",
    description: "Navigation between overview, API, and examples mirrors the same content model shown in docs stories.",
    href: "/docs/tabs",
    props: ['variant="pills"', 'defaultValue="api"', "onChange"],
    preview: (
      <Tabs defaultValue="api" variant="pills">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="api">API</Tabs.Trigger>
          <Tabs.Trigger value="examples">Examples</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="overview">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Mental models and layout guidance for production pages.
          </p>
        </Tabs.Content>
        <Tabs.Content value="api">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Typed props line up with the component source and docs tables.
          </p>
        </Tabs.Content>
        <Tabs.Content value="examples">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Preview states stay visually in sync with Storybook examples.
          </p>
        </Tabs.Content>
      </Tabs>
    ),
  },
];

export function ComponentShowcaseSection() {
  return (
    <section
      id="components"
      className="relative overflow-hidden bg-white px-6 py-24 dark:bg-slate-900"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute left-1/2 top-20 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary dark:border-primary/20 dark:bg-primary/10">
              <span className="material-symbols-outlined text-base">deployed_code</span>
              Component showcase
            </div>
            <h2 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              See the UI kit in motion before you ever leave the landing page.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              These previews mirror the same scenarios documented in Storybook, so the landing page highlights real
              component states instead of static marketing screenshots.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/20">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white p-3 text-primary shadow-sm dark:bg-slate-900">
                <span className="material-symbols-outlined">stack_star</span>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Storybook signal
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Variants, states, and prop combinations are lifted from the component stories so the marketing layer
                  stays honest to the implementation.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                4 live previews
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                Key props surfaced
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300">
                Light and dark ready
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {COMPONENT_SHOWCASES.map((component) => (
            <article
              key={component.name}
              className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-background-light p-6 shadow-lg shadow-slate-200/40 transition-transform duration-200 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-950 dark:shadow-black/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Story: {component.story}
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {component.name}
                  </h3>
                </div>
                <Link
                  href={component.href}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                >
                  Docs
                  <span className="material-symbols-outlined text-base">arrow_outward</span>
                </Link>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{component.description}</p>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0b0e14]">
                {component.preview}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {component.props.map((prop) => (
                  <span
                    key={prop}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                  >
                    {prop}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-primary/15 bg-primary/5 p-8 dark:border-primary/20 dark:bg-primary/10">
          <div className="mb-8">
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Ready to go deeper?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Jump into the docs for API detail or browse the cookbook to see the same primitives inside larger product flows.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/docs/introduction"
              className="group flex flex-col gap-3 rounded-2xl border border-primary/20 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </span>
                <span className="material-symbols-outlined text-[16px] text-slate-300 transition-colors group-hover:text-primary dark:text-slate-600">
                  arrow_forward
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Browse Docs</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Full API reference, props tables, and usage examples.
                </p>
              </div>
            </Link>

            <Link
              href="/create"
              className="group flex flex-col gap-3 rounded-2xl border border-primary/20 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </span>
                <span className="material-symbols-outlined text-[16px] text-slate-300 transition-colors group-hover:text-primary dark:text-slate-600">
                  arrow_forward
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Configure Project</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Pick your stack, components, and style — then scaffold instantly.
                </p>
              </div>
            </Link>

            <Link
              href="/nextjs/cookbook"
              className="group flex flex-col gap-3 rounded-2xl border border-primary/20 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </span>
                <span className="material-symbols-outlined text-[16px] text-slate-300 transition-colors group-hover:text-primary dark:text-slate-600">
                  arrow_forward
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Open Cookbook</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Production patterns using these primitives in real flows.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
