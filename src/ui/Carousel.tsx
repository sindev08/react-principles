"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CarouselOrientation = "horizontal" | "vertical";

export interface CarouselOptions {
  loop?: boolean;
  align?: "start" | "center";
}

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

export interface CarouselButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

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
  if (!ctx) {
    throw new Error("Carousel sub-components must be used within <Carousel>");
  }
  return ctx;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DRAG_THRESHOLD = 30;
const RUBBER_BAND_FACTOR = 0.3;
const TRANSITION_DURATION = 300;

// ─── Carousel (root) ─────────────────────────────────────────────────────────

export function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  children,
  className,
}: CarouselProps) {
  const loop = opts?.loop ?? false;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [containerSize, setContainerSize] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemCountRef = useRef(0);
  const currentIndexRef = useRef(0);

  // Keep refs in sync
  useEffect(() => {
    itemCountRef.current = itemCount;
    currentIndexRef.current = currentIndex;
  }, [itemCount, currentIndex]);

  // Measure container size
  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (orientation === "horizontal") {
      setContainerSize(el.offsetWidth);
    } else {
      setContainerSize(el.offsetHeight);
    }
  }, [orientation]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Navigation logic
  const canScrollPrev = loop ? true : currentIndex > 0;
  const canScrollNext = loop ? true : currentIndex < itemCount - 1;

  const scrollTo = useCallback(
    (index: number) => {
      const count = itemCountRef.current;
      if (count === 0) return;
      const clamped = loop
        ? ((index % count) + count) % count
        : Math.max(0, Math.min(index, count - 1));
      setCurrentIndex(clamped);
    },
    [loop],
  );

  const scrollPrev = useCallback(() => {
    scrollTo(currentIndexRef.current - 1);
  }, [scrollTo]);

  const scrollNext = useCallback(() => {
    scrollTo(currentIndexRef.current + 1);
  }, [scrollTo]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isHorizontal = orientation === "horizontal";
      const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
      const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";

      if (e.key === prevKey) {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === nextKey) {
        e.preventDefault();
        scrollNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollTo(itemCountRef.current - 1);
      }
    },
    [orientation, scrollPrev, scrollNext, scrollTo],
  );

  // Build stable API
  const [api, setApiState] = useState<CarouselApi>(() => ({
    scrollPrev,
    scrollNext,
    scrollTo,
    canScrollPrev: () => canScrollPrev,
    canScrollNext: () => canScrollNext,
    getCurrentIndex: () => currentIndexRef.current,
    getItemCount: () => itemCountRef.current,
  }));

  useEffect(() => {
    setApiState({
      scrollPrev,
      scrollNext,
      scrollTo,
      canScrollPrev: () => canScrollPrev,
      canScrollNext: () => canScrollNext,
      getCurrentIndex: () => currentIndexRef.current,
      getItemCount: () => itemCountRef.current,
    });
  }, [scrollPrev, scrollNext, scrollTo, canScrollPrev, canScrollNext]);

  useEffect(() => {
    if (setApi) setApi(api);
  }, [setApi, api]);

  // Item registration
  const registerItem = useCallback(() => {
    setItemCount((prev) => prev + 1);
  }, []);

  const unregisterItem = useCallback(() => {
    setItemCount((prev) => Math.max(0, prev - 1));
  }, []);

  const contextValue: CarouselContextValue = {
    currentIndex,
    orientation,
    loop,
    itemCount,
    containerSize,
    registerItem,
    unregisterItem,
    scrollPrev,
    scrollNext,
    scrollTo,
    canScrollPrev,
    canScrollNext,
    api,
  };

  return (
    <CarouselContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Carousel"
        tabIndex={0}
        className={cn("relative overflow-hidden", className)}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

// ─── CarouselContent (track) ─────────────────────────────────────────────────

Carousel.Content = function CarouselContent({
  children,
  className,
  ...props
}: CarouselContentProps) {
  const {
    currentIndex,
    orientation,
    loop,
    itemCount,
    containerSize,
    scrollPrev,
    scrollNext,
  } = useCarouselContext();

  const trackRef = useRef<HTMLDivElement>(null);

  // Drag state refs (use refs to avoid re-renders during drag)
  const isDraggingRef = useRef(false);
  const startClientRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const startTranslateRef = useRef(0);

  // Expose drag helpers to prev/next buttons
  const triggerPrev = useCallback(() => scrollPrev(), [scrollPrev]);
  const triggerNext = useCallback(() => scrollNext(), [scrollNext]);

  // We need a state for render-triggered translate (snap position)
  const [snapTranslate, setSnapTranslate] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Compute snap translate when currentIndex or containerSize changes
  useEffect(() => {
    setSnapTranslate(-currentIndex * containerSize);
  }, [currentIndex, containerSize]);

  // Combine snap + drag offset for the final transform
  const translateValue = isDragging
    ? startTranslateRef.current + dragOffsetRef.current
    : snapTranslate;

  const axis = orientation === "horizontal" ? "X" : "Y";

  // Pointer event handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;

      e.preventDefault();
      const track = trackRef.current;
      if (!track) return;

      track.setPointerCapture(e.pointerId);
      pointerIdRef.current = e.pointerId;
      isDraggingRef.current = true;
      setIsDragging(true);
      startTimeRef.current = Date.now();

      const clientPos =
        orientation === "horizontal" ? e.clientX : e.clientY;
      startClientRef.current = clientPos;
      dragOffsetRef.current = 0;
      startTranslateRef.current = snapTranslate;
    },
    [orientation, snapTranslate],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();

      const clientPos =
        orientation === "horizontal" ? e.clientX : e.clientY;
      const delta = clientPos - startClientRef.current;

      // Apply rubber-band at edges when not looping
      if (!loop && itemCount > 0) {
        const atStart = currentIndex <= 0 && delta > 0;
        const atEnd = currentIndex >= itemCount - 1 && delta < 0;
        if (atStart || atEnd) {
          dragOffsetRef.current = delta * RUBBER_BAND_FACTOR;
        } else {
          dragOffsetRef.current = delta;
        }
      } else {
        dragOffsetRef.current = delta;
      }
    },
    [orientation, loop, currentIndex, itemCount],
  );

  const handlePointerUp = useCallback(
    (_e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      setIsDragging(false);

      const track = trackRef.current;
      if (track && pointerIdRef.current !== null) {
        try {
          track.releasePointerCapture(pointerIdRef.current);
        } catch {
          // Pointer may already be released
        }
      }
      pointerIdRef.current = null;

      const elapsed = Date.now() - startTimeRef.current;
      const velocity = Math.abs(dragOffsetRef.current) / Math.max(elapsed, 1);

      const exceededThreshold =
        Math.abs(dragOffsetRef.current) > DRAG_THRESHOLD;
      const fastSwipe = velocity > 0.3 && elapsed < 500;

      if (exceededThreshold || fastSwipe) {
        if (dragOffsetRef.current < 0) {
          triggerNext();
        } else if (dragOffsetRef.current > 0) {
          triggerPrev();
        }
      }

      dragOffsetRef.current = 0;
    },
    [triggerPrev, triggerNext],
  );

  const handlePointerCancel = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    pointerIdRef.current = null;
    dragOffsetRef.current = 0;
  }, []);

  return (
    <div
      ref={trackRef}
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        isDragging ? "select-none" : "",
        className,
      )}
      style={{
        transform: `translate${axis}(${translateValue}px)`,
        transition: isDragging ? "none" : `transform ${TRANSITION_DURATION}ms ease-out`,
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      {...props}
    >
      {children}
    </div>
  );
};

// ─── CarouselItem ────────────────────────────────────────────────────────────

Carousel.Item = function CarouselItem({
  children,
  className,
  ...props
}: CarouselItemProps) {
  const { registerItem, unregisterItem } = useCarouselContext();

  useEffect(() => {
    registerItem();
    return () => unregisterItem();
  }, [registerItem, unregisterItem]);

  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn("flex-shrink-0", className)}
      style={{
        flexBasis: "100%",
        minHeight: 0,
        minWidth: 0,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// ─── CarouselPrevious ────────────────────────────────────────────────────────

Carousel.Previous = function CarouselPrevious({
  children,
  className,
  disabled: externalDisabled,
  ...props
}: CarouselButtonProps) {
  const { scrollPrev, canScrollPrev, orientation } = useCarouselContext();

  const isHorizontal = orientation === "horizontal";
  const iconName = isHorizontal ? "chevron_left" : "expand_less";

  const disabled = externalDisabled ?? !canScrollPrev;

  return (
    <button
      type="button"
      onClick={scrollPrev}
      disabled={disabled}
      aria-label="Previous slide"
      className={cn(
        "absolute z-10 flex h-8 w-8 items-center justify-center rounded-full",
        "bg-white/80 text-slate-700 shadow-xs backdrop-blur-sm transition-all",
        "hover:bg-white dark:bg-[#0d1117]/80 dark:text-slate-300 dark:hover:bg-[#0d1117]",
        "disabled:pointer-events-none disabled:opacity-50",
        isHorizontal
          ? "left-2 top-1/2 -translate-y-1/2"
          : "top-2 left-1/2 -translate-x-1/2",
        className,
      )}
      {...props}
    >
      {children ?? (
        <span className="material-symbols-outlined text-[20px]">{iconName}</span>
      )}
    </button>
  );
};

// ─── CarouselNext ────────────────────────────────────────────────────────────

Carousel.Next = function CarouselNext({
  children,
  className,
  disabled: externalDisabled,
  ...props
}: CarouselButtonProps) {
  const { scrollNext, canScrollNext, orientation } = useCarouselContext();

  const isHorizontal = orientation === "horizontal";
  const iconName = isHorizontal ? "chevron_right" : "expand_more";

  const disabled = externalDisabled ?? !canScrollNext;

  return (
    <button
      type="button"
      onClick={scrollNext}
      disabled={disabled}
      aria-label="Next slide"
      className={cn(
        "absolute z-10 flex h-8 w-8 items-center justify-center rounded-full",
        "bg-white/80 text-slate-700 shadow-xs backdrop-blur-sm transition-all",
        "hover:bg-white dark:bg-[#0d1117]/80 dark:text-slate-300 dark:hover:bg-[#0d1117]",
        "disabled:pointer-events-none disabled:opacity-50",
        isHorizontal
          ? "right-2 top-1/2 -translate-y-1/2"
          : "bottom-2 left-1/2 -translate-x-1/2",
        className,
      )}
      {...props}
    >
      {children ?? (
        <span className="material-symbols-outlined text-[20px]">{iconName}</span>
      )}
    </button>
  );
};
