# UX Animations — Plan & Decisions

> This document summarizes all planned animation improvements,
> including the root cause of bugs found and design decisions.

---

## 1. Modal Bug — Root Cause

**Symptom:** Modal opens with backdrop blur but the panel is not visible and
all elements are unclickable.

**Root cause:** In `Modal.tsx`, the `enter` constant is directly applied
as a className on render:

```tsx
// SIDE_CLASSES["right"] → { panel: "right-0 inset-y-0", enter: "translate-x-full" }
const { panel, enter } = SIDE_CLASSES[side];

className={cn(
  "absolute flex flex-col h-full ...",
  enter,          // ← "translate-x-full" — panel renders OFF-SCREEN
  SIZE_CLASSES[size],
  panel,
)}
```

`translate-x-full` pushes the panel 100% of the viewport to the right.
Because there is no `transition` CSS and no mechanism to change
this class to `translate-x-0`, the panel is permanently off-screen. The backdrop
renders normally (that's the blur), but because the panel is invisible and
the backdrop captures all pointer events, all clicks are blocked.

**Fix:** Don't apply the `enter` class when the panel is open. Use
`translate-x-0` when `open: true` and the `enter` class when `open: false`,
with `transition-transform duration-300` to animate.

---

## 2. Dialog vs Modal — Naming Clarification

These are **not the same component**. The differences:

| | Dialog | Modal (Drawer) |
|---|---|---|
| **Position** | Center screen | Slides from screen edge (left/right) |
| **Purpose** | Confirmation, short form, detail info | Navigation panel, settings, detail record |
| **Dismiss** | Backdrop click + Escape | Backdrop click + Escape |
| **Size** | `sm` → `xl` (max-width) | `sm` → `full` (drawer width) |
| **Animation** | Fade in + scale up from center | Slide in from left/right |

**Naming issue:** "Modal" as a name for a side-drawer is confusing
because in most design systems (Material, Chakra, Radix), "modal"
means a center overlay — identical to Dialog.

**Recommendation:** Rename `Modal` → `Drawer` or `Sheet`.

- `Drawer` — more common, used by Shadcn/ui, Radix, MUI
- `Sheet` — used by Shadcn/ui specifically for full-height side panels

For the doc page: update the breadcrumb from `Overlay > Modal` → `Overlay > Drawer`,
and update all usage examples. This is a small breaking change — only
touching doc pages and file names.

---

## 3. Planned Animations

### 3a. Page Transitions

**Current issue:** Navigating between pages snaps instantly without a transition.

**Recommendation: View Transitions API (native, no library)**

```ts
// Wrap navigation with startViewTransition
document.startViewTransition(() => {
  flushSync(() => navigate(to));
});
```

Advantages:
- Zero dependency
- Browser handles everything: automatic cross-fade between pages
- Customizable via CSS `::view-transition-old` and `::view-transition-new`
- Supported: Chrome 111+, Edge 111+, Safari 18+ — sufficient for modern apps

Additional CSS in `index.css`:

```css
@keyframes fade-in  { from { opacity: 0; translate: 0 8px } }
@keyframes fade-out { to   { opacity: 0; translate: 0 -8px } }

::view-transition-old(root) {
  animation: 150ms ease fade-out;
}
::view-transition-new(root) {
  animation: 200ms ease fade-in;
}
```

Effect: the old page fades+slides up out, the new page fades+slides in
from below. Subtle, not distracting.

**Fallback (browser not supported):** None — navigation remains normal
snap without error.

**For Next.js App Router:** Use `useRouter` with a similar wrapper,
or wait for Next.js built-in View Transitions support which is under
development.

---

### 3b. Dialog Animation

**Current issue:** Dialog appears suddenly (`if (!open) return null`
immediately unmounts, no exit animation).

**Approach: mount-based with CSS state classes**

Change from `if (!open) return null` to staying mounted but with
a visibility state:

```
open: true  → data-state="open"  → animate in
open: false → data-state="closed" → animate out → unmount after delay
```

**Appropriate animation for Dialog:**

```
Enter: opacity 0→1 + scale 95%→100% (fade + scale up from center)
Exit:  opacity 1→0 + scale 100%→95% (fade + scale down)
Duration: 200ms ease-out (enter), 150ms ease-in (exit)
```

This is the standard pattern for center overlays — it feels like it "emerges" from
the center point, not coming from a specific direction.

Tailwind classes (with `tailwindcss-animate` plugin):

```tsx
// Overlay
"data-[state=open]:animate-in data-[state=closed]:animate-out"
"data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"

// Panel
"data-[state=open]:animate-in data-[state=closed]:animate-out"
"data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
"data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
"duration-200"
```

Or without the plugin (pure CSS via `@keyframes` in global CSS):

```css
@keyframes dialog-in {
  from { opacity: 0; transform: scale(0.95) translateY(4px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);   }
}
@keyframes dialog-out {
  from { opacity: 1; transform: scale(1)    translateY(0);   }
  to   { opacity: 0; transform: scale(0.95) translateY(4px); }
}
```

---

### 3c. AlertDialog Animation

AlertDialog already uses Dialog internally (via `createPortal`
directly, not composing with Dialog). The same animation applies:

```
Enter: fade + scale 95%→100%
Exit:  scale 100%→95% + fade
```

Additional for AlertDialog: the icon animation (warning/destructive) can
have a `delay-75` so it appears slightly after the panel — giving emphasis
to the icon.

---

### 3d. Modal (Drawer) Animation — Fix and Animate at Once

This fixes the bug while also adding animation. Change the approach from "apply enter
class directly" to "transition from enter to translate-x-0".

**Appropriate animation for Drawer:**

```
Enter: slide in from right/left (translate-x-full → translate-x-0)
Exit:  slide out to right/left (translate-x-0 → translate-x-full)
Backdrop: fade in/out simultaneously
Duration: 300ms ease (slower than Dialog — larger panel)
```

```tsx
// Panel class based on state
const panelClass = cn(
  "absolute flex flex-col h-full transition-transform duration-300 ease-in-out",
  open ? "translate-x-0" : SIDE_CLASSES[side].enter,
  // ...
)

// Backdrop class
const backdropClass = cn(
  "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
  open ? "opacity-100" : "opacity-0"
)
```

Important: with this approach the component must not return null directly —
it must remain mounted during the exit animation (use `useTimeout`
or `onTransitionEnd` before unmounting).

---

### 3e. Tabs Animation

**Current issue:** Tab content switches instantly.

**Two animations to consider:**

**1. Indicator/underline animation** (for `underline` variant):

Instead of the underline "jumping" directly to the active tab, use a `transition`
on the indicator position. The implementation requires measuring the position of the
active trigger and moving an absolute-positioned indicator bar:

```tsx
// Use ref to measure active trigger position
// Move indicator with transform: translateX(measuredLeft)
// transition: transform 200ms ease
```

**2. Content fade transition:**

```
Exit:  opacity 1→0, duration 100ms
Enter: opacity 0→1, duration 150ms
```

Old content fades out, new content fades in. They don't need to
overlap — sequential fade is already smooth enough.

Approach without `key` prop (avoid unmount/remount):

```tsx
// All TabsContent remains in the DOM, visibility controlled by CSS
// data-[state=active]: opacity-100, pointer-events-auto
// data-[state=inactive]: opacity-0, pointer-events-none, absolute
```

---

## 4. Implementation Priority

| # | Item | Urgency | Effort |
|---|---|---|---|
| 1 | **Fix Modal bug** | Blocker | Small — only fix class logic |
| 2 | **Dialog animation** | High | Medium — needs state machine |
| 3 | **AlertDialog animation** | High | Small — follows Dialog |
| 4 | **Rename Modal → Drawer** | Medium | Medium — rename file + doc pages |
| 5 | **Tabs content fade** | Medium | Small |
| 6 | **Page transitions** | Medium | Small — View Transitions API |
| 7 | **Tabs indicator animation** | Low | Large — needs DOM measurement |

---

## 5. Architecture Decisions

### Use animation library or not?

**Recommendation: Framer Motion is not needed for this scope.**

All animations above can be done with:
- CSS transitions + Tailwind classes
- Native View Transitions API
- One helper hook `useAnimatedMount` (delay unmount on close)

Framer Motion is worth it when there is a need for: drag, spring physics, layout
animations, gesture-based interactions. For overlay open/close and page
transitions, CSS is sufficient and the result is lighter (+47KB bundle for
Framer Motion vs 0KB for CSS).

### tailwindcss-animate plugin?

Optional. This plugin (used by shadcn/ui) adds classes like
`animate-in`, `fade-in-0`, `zoom-in-95`, etc. Without the plugin, we can
define `@keyframes` in global CSS and apply them directly. Consider
installing it if we want to stay consistent with the shadcn/ui ecosystem.

---

## 6. Hook Pattern — `useAnimatedMount`

All overlays (Dialog, Modal, AlertDialog) need the same pattern:
"stay mounted during exit animation, unmount after it finishes."

```ts
function useAnimatedMount(open: boolean, duration = 300) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // One frame delay so the browser paints before animating
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), duration);
      return () => clearTimeout(t);
    }
  }, [open, duration]);

  return { mounted, visible };
}

// Usage in Dialog:
const { mounted, visible } = useAnimatedMount(open);
if (!mounted) return null;
// visible → data-state="open" | "closed"
```

`mounted` controls whether the component exists in the DOM.
`visible` controls whether the "open" animation classes are active.
