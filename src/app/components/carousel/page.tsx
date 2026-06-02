"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { cn } from "@/shared/utils/cn";
import { Carousel } from "@/ui/Carousel";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF =
  "https://storybook.reactprinciples.dev/?path=/story/ui-carousel--default";

const SLIDES = [
  { label: "Slide 1", color: "bg-primary/10" },
  { label: "Slide 2", color: "bg-blue-100 dark:bg-blue-900/30" },
  { label: "Slide 3", color: "bg-green-100 dark:bg-green-900/30" },
  { label: "Slide 4", color: "bg-amber-100 dark:bg-amber-900/30" },
  { label: "Slide 5", color: "bg-purple-100 dark:bg-purple-900/30" },
];

const CODE_SNIPPET = `import { Carousel } from "@/ui/Carousel";

<Carousel>
  <Carousel.Content>
    <Carousel.Item>Slide 1</Carousel.Item>
    <Carousel.Item>Slide 2</Carousel.Item>
    <Carousel.Item>Slide 3</Carousel.Item>
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel>

// With loop mode
<Carousel opts={{ loop: true }}>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel>

// Vertical orientation
<Carousel orientation="vertical" className="h-[400px]">
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel>

// Programmatic control via setApi
<Carousel setApi={(api) => { window.carouselApi = api; }}>
  <Carousel.Content>
    <Carousel.Item>...</Carousel.Item>
  </Carousel.Content>
</Carousel>`;

const COPY_PASTE_SNIPPET = `"use client";

import {
  createContext, useCallback, useContext, useEffect, useLayoutEffect,
  useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CarouselOrientation = "horizontal" | "vertical";
export interface CarouselOptions { loop?: boolean; align?: "start" | "center"; }
export interface CarouselApi {
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  getCurrentIndex: () => number;
  getItemCount: () => number;
}
export interface CarouselProps {
  orientation?: CarouselOrientation;
  opts?: CarouselOptions;
  setApi?: (api: CarouselApi) => void;
  children: ReactNode;
  className?: string;
}
export type CarouselContentProps = HTMLAttributes<HTMLDivElement>;
export type CarouselItemProps = HTMLAttributes<HTMLDivElement>;
export interface CarouselButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { children?: ReactNode; }

// ─── Context ──────────────────────────────────────────────────────────────────

interface CarouselContextValue {
  currentIndex: number;
  orientation: CarouselOrientation;
  loop: boolean;
  itemCount: number;
  containerSize: number;
  registerItem: () => void;
  unregisterItem: () => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  api: CarouselApi;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarouselContext(): CarouselContextValue {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel sub-components must be used within <Carousel>");
  return ctx;
}

const DRAG_THRESHOLD = 30;
const RUBBER_BAND_FACTOR = 0.3;
const TRANSITION_DURATION = 300;

// ─── Carousel (root) ─────────────────────────────────────────────────────────

export function Carousel({
  orientation = "horizontal", opts, setApi, children, className,
}: CarouselProps) {
  const loop = opts?.loop ?? false;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [containerSize, setContainerSize] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemCountRef = useRef(0);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    itemCountRef.current = itemCount;
    currentIndexRef.current = currentIndex;
  }, [itemCount, currentIndex]);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerSize(orientation === "horizontal" ? el.offsetWidth : el.offsetHeight);
  }, [orientation]);

  useLayoutEffect(() => { measure(); }, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const canScrollPrev = loop ? true : currentIndex > 0;
  const canScrollNext = loop ? true : currentIndex < itemCount - 1;

  const scrollTo = useCallback((index: number) => {
    const count = itemCountRef.current;
    if (count === 0) return;
    const clamped = loop
      ? ((index % count) + count) % count
      : Math.max(0, Math.min(index, count - 1));
    setCurrentIndex(clamped);
  }, [loop]);

  const scrollPrev = useCallback(() => scrollTo(currentIndexRef.current - 1), [scrollTo]);
  const scrollNext = useCallback(() => scrollTo(currentIndexRef.current + 1), [scrollTo]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const isHorizontal = orientation === "horizontal";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    if (e.key === prevKey) { e.preventDefault(); scrollPrev(); }
    else if (e.key === nextKey) { e.preventDefault(); scrollNext(); }
    else if (e.key === "Home") { e.preventDefault(); scrollTo(0); }
    else if (e.key === "End") { e.preventDefault(); scrollTo(itemCountRef.current - 1); }
  }, [orientation, scrollPrev, scrollNext, scrollTo]);

  const [api, setApiState] = useState<CarouselApi>(() => ({
    scrollPrev, scrollNext, scrollTo,
    canScrollPrev: () => canScrollPrev,
    canScrollNext: () => canScrollNext,
    getCurrentIndex: () => currentIndexRef.current,
    getItemCount: () => itemCountRef.current,
  }));

  useEffect(() => {
    setApiState({
      scrollPrev, scrollNext, scrollTo,
      canScrollPrev: () => canScrollPrev,
      canScrollNext: () => canScrollNext,
      getCurrentIndex: () => currentIndexRef.current,
      getItemCount: () => itemCountRef.current,
    });
  }, [scrollPrev, scrollNext, scrollTo, canScrollPrev, canScrollNext]);

  useEffect(() => { if (setApi) setApi(api); }, [setApi, api]);

  const registerItem = useCallback(() => setItemCount((p) => p + 1), []);
  const unregisterItem = useCallback(() => setItemCount((p) => Math.max(0, p - 1)), []);

  return (
    <CarouselContext.Provider
      value={{
        currentIndex, orientation, loop, itemCount, containerSize,
        registerItem, unregisterItem, scrollPrev, scrollNext, scrollTo,
        canScrollPrev, canScrollNext, api,
      }}
    >
      <div ref={containerRef} role="region" aria-roledescription="carousel"
        aria-label="Carousel" tabIndex={0} className={cn("relative overflow-hidden", className)}
        onKeyDown={handleKeyDown}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

// ─── CarouselContent (track) ─────────────────────────────────────────────────

Carousel.Content = function CarouselContent({ children, className, ...props }: CarouselContentProps) {
  const { currentIndex, orientation, loop, itemCount, containerSize, scrollPrev, scrollNext } = useCarouselContext();
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startClientRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const startTranslateRef = useRef(0);
  const triggerPrev = useCallback(() => scrollPrev(), [scrollPrev]);
  const triggerNext = useCallback(() => scrollNext(), [scrollNext]);
  const [snapTranslate, setSnapTranslate] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => { setSnapTranslate(-currentIndex * containerSize); }, [currentIndex, containerSize]);

  const translateValue = isDragging ? startTranslateRef.current + dragOffsetRef.current : snapTranslate;
  const axis = orientation === "horizontal" ? "X" : "Y";

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    const track = trackRef.current;
    if (!track) return;
    track.setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;
    isDraggingRef.current = true;
    setIsDragging(true);
    startTimeRef.current = Date.now();
    startClientRef.current = orientation === "horizontal" ? e.clientX : e.clientY;
    dragOffsetRef.current = 0;
    startTranslateRef.current = snapTranslate;
  }, [orientation, snapTranslate]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const clientPos = orientation === "horizontal" ? e.clientX : e.clientY;
    const delta = clientPos - startClientRef.current;
    if (!loop && itemCount > 0) {
      const atStart = currentIndex <= 0 && delta > 0;
      const atEnd = currentIndex >= itemCount - 1 && delta < 0;
      dragOffsetRef.current = (atStart || atEnd) ? delta * RUBBER_BAND_FACTOR : delta;
    } else {
      dragOffsetRef.current = delta;
    }
  }, [orientation, loop, currentIndex, itemCount]);

  const handlePointerUp = useCallback((_e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const track = trackRef.current;
    if (track && pointerIdRef.current !== null) {
      try { track.releasePointerCapture(pointerIdRef.current); } catch { /* already released */ }
    }
    pointerIdRef.current = null;
    const elapsed = Date.now() - startTimeRef.current;
    const velocity = Math.abs(dragOffsetRef.current) / Math.max(elapsed, 1);
    if (Math.abs(dragOffsetRef.current) > DRAG_THRESHOLD || (velocity > 0.3 && elapsed < 500)) {
      if (dragOffsetRef.current < 0) triggerNext();
      else if (dragOffsetRef.current > 0) triggerPrev();
    }
    dragOffsetRef.current = 0;
  }, [triggerPrev, triggerNext]);

  const handlePointerCancel = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    pointerIdRef.current = null;
    dragOffsetRef.current = 0;
  }, []);

  return (
    <div ref={trackRef}
      className={cn("flex", orientation === "horizontal" ? "flex-row" : "flex-col", isDragging ? "select-none" : "", className)}
      style={{
        transform: \`translate\${axis}(\${translateValue}px)\`,
        transition: isDragging ? "none" : \`transform \${TRANSITION_DURATION}ms ease-out\`,
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp} onPointerCancel={handlePointerCancel}
      {...props}>
      {children}
    </div>
  );
};

// ─── CarouselItem ────────────────────────────────────────────────────────────

Carousel.Item = function CarouselItem({ children, className, ...props }: CarouselItemProps) {
  const { registerItem, unregisterItem } = useCarouselContext();
  useEffect(() => { registerItem(); return () => unregisterItem(); }, [registerItem, unregisterItem]);
  return (
    <div role="group" aria-roledescription="slide"
      className={cn("flex-shrink-0", className)}
      style={{ flexBasis: "100%", minHeight: 0, minWidth: 0 }}
      {...props}>
      {children}
    </div>
  );
};

// ─── CarouselPrevious ────────────────────────────────────────────────────────

Carousel.Previous = function CarouselPrevious({ children, className, disabled: extDisabled, ...props }: CarouselButtonProps) {
  const { scrollPrev, canScrollPrev, orientation } = useCarouselContext();
  const isHorizontal = orientation === "horizontal";
  return (
    <button type="button" onClick={scrollPrev} disabled={extDisabled ?? !canScrollPrev} aria-label="Previous slide"
      className={cn(
        "absolute z-10 flex h-8 w-8 items-center justify-center rounded-full",
        "bg-white/80 text-slate-700 shadow-xs backdrop-blur-sm transition-all",
        "hover:bg-white dark:bg-[#0d1117]/80 dark:text-slate-300 dark:hover:bg-[#0d1117]",
        "disabled:pointer-events-none disabled:opacity-50",
        isHorizontal ? "left-2 top-1/2 -translate-y-1/2" : "top-2 left-1/2 -translate-x-1/2",
        className,
      )}
      {...props}>
      {children ?? <span className="material-symbols-outlined text-[20px]">{isHorizontal ? "chevron_left" : "expand_less"}</span>}
    </button>
  );
};

// ─── CarouselNext ────────────────────────────────────────────────────────────

Carousel.Next = function CarouselNext({ children, className, disabled: extDisabled, ...props }: CarouselButtonProps) {
  const { scrollNext, canScrollNext, orientation } = useCarouselContext();
  const isHorizontal = orientation === "horizontal";
  return (
    <button type="button" onClick={scrollNext} disabled={extDisabled ?? !canScrollNext} aria-label="Next slide"
      className={cn(
        "absolute z-10 flex h-8 w-8 items-center justify-center rounded-full",
        "bg-white/80 text-slate-700 shadow-xs backdrop-blur-sm transition-all",
        "hover:bg-white dark:bg-[#0d1117]/80 dark:text-slate-300 dark:hover:bg-[#0d1117]",
        "disabled:pointer-events-none disabled:opacity-50",
        isHorizontal ? "right-2 top-1/2 -translate-y-1/2" : "bottom-2 left-1/2 -translate-x-1/2",
        className,
      )}
      {...props}>
      {children ?? <span className="material-symbols-outlined text-[20px]">{isHorizontal ? "chevron_right" : "expand_more"}</span>}
    </button>
  );
};`;

const PROPS_ROWS = [
  { prop: "orientation", type: '"horizontal" | "vertical"', required: false, default: '"horizontal"', description: "Scroll direction of the carousel." },
  { prop: "opts.loop", type: "boolean", required: false, default: "false", description: "Whether to wrap from last to first item." },
  { prop: "opts.align", type: '"start" | "center"', required: false, default: '"start"', description: "How items align within the viewport." },
  { prop: "setApi", type: "(api: CarouselApi) => void", required: false, default: "—", description: "Callback to access the carousel API for programmatic control." },
  { prop: "className", type: "string", required: false, default: "—", description: "Additional classes merged into the root container." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function DemoSlides() {
  return SLIDES.map((s, i) => (
    <Carousel.Item key={i}>
      <div className={cn("flex h-48 items-center justify-center rounded-lg", s.color)}>
        <span className="text-xl font-bold text-slate-700 dark:text-slate-300">{s.label}</span>
      </div>
    </Carousel.Item>
  ));
}

export default function CarouselDocPage() {
  const [loopEnabled, setLoopEnabled] = useState(false);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="cursor-pointer transition-colors hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="cursor-pointer transition-colors hover:text-primary">Layout</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Carousel</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Carousel
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A horizontal or vertical content slider with touch drag support, loop mode,
            and keyboard navigation. Built as a compound component with
            Carousel.Content, Carousel.Item, Carousel.Previous, and Carousel.Next.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Touch/Drag", "Keyboard Nav", "Loop Mode", "Compound API"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-[#1f2937] dark:bg-[#161b22] dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="carousel" />

        {/* 01 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <a
            href={STORYBOOK_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-fade-in mb-4 flex w-full items-center gap-3 rounded-lg border border-[#FF4785]/20 bg-[#FF4785]/5 px-4 py-3 transition-opacity hover:opacity-80"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4785] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF4785]" />
            </span>
            <p className="flex-1 text-xs text-slate-500 dark:text-slate-400">
              Explore all variants and interactive states in Storybook.
            </p>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF4785]">
              Open Storybook
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </span>
          </a>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-[#1f2937] dark:bg-[#161b22]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                Options
              </span>
              <button
                onClick={() => setLoopEnabled(!loopEnabled)}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                  loopEnabled
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1f2937] dark:text-slate-400 dark:hover:bg-[#2d3748]",
                )}
              >
                Loop {loopEnabled ? "On" : "Off"}
              </button>
            </div>
            <Carousel opts={{ loop: loopEnabled }} className="w-full">
              <Carousel.Content>
                <DemoSlides />
              </Carousel.Content>
              <Carousel.Previous />
              <Carousel.Next />
            </Carousel>
          </div>
        </section>

        {/* 02 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Carousel.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 03 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Carousel.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Props */}
        <section id="props" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-[#1f2937] dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white dark:divide-[#1f2937] dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr
                    key={row.prop}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]"
                  >
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="max-w-[240px] px-4 py-3">
                      <code className="wrap-break-word font-mono text-xs text-slate-600 dark:text-slate-400">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.default}</code>
                    </td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
