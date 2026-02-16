# UX Animations — Plan & Decisions

> Dokumen ini merangkum semua improvement animasi yang direncanakan,
> termasuk root cause dari bug yang ditemukan dan keputusan desain.

---

## 1. Modal Bug — Root Cause

**Gejala:** Modal membuka backdrop blur tapi panel tidak terlihat dan
semua elemen tidak bisa diklik.

**Root cause:** Di `Modal.tsx`, konstanta `enter` langsung di-apply
sebagai className saat render:

```tsx
// SIDE_CLASSES["right"] → { panel: "right-0 inset-y-0", enter: "translate-x-full" }
const { panel, enter } = SIDE_CLASSES[side];

className={cn(
  "absolute flex flex-col h-full ...",
  enter,          // ← "translate-x-full" — panel render OFF-SCREEN
  SIZE_CLASSES[size],
  panel,
)}
```

`translate-x-full` mendorong panel sejauh 100% dari viewport ke kanan.
Karena tidak ada `transition` CSS dan tidak ada mekanisme yang mengubah
class ini menjadi `translate-x-0`, panel selamanya off-screen. Backdrop
render normal (itulah blur-nya), tapi karena panel tidak terlihat dan
backdrop menangkap semua pointer events, semua klik tertahan.

**Fix:** Jangan apply `enter` class saat panel terbuka. Gunakan
`translate-x-0` saat `open: true` dan `enter` class saat `open: false`,
dengan `transition-transform duration-300` agar beranimasi.

---

## 2. Dialog vs Modal — Klarifikasi Naming

Keduanya **bukan komponen yang sama**. Perbedaannya:

| | Dialog | Modal (Drawer) |
|---|---|---|
| **Posisi** | Center screen | Slide dari sisi layar (kiri/right) |
| **Tujuan** | Konfirmasi, form singkat, info detail | Navigation panel, settings, detail record |
| **Dismiss** | Backdrop click + Escape | Backdrop click + Escape |
| **Ukuran** | `sm` → `xl` (max-width) | `sm` → `full` (width drawer) |
| **Animasi** | Fade in + scale up dari center | Slide in dari kiri/kanan |

**Masalah naming:** "Modal" sebagai nama untuk side-drawer membingungkan
karena di sebagian besar design system (Material, Chakra, Radix), "modal"
berarti center overlay — identik dengan Dialog.

**Rekomendasi:** Rename `Modal` → `Drawer` atau `Sheet`.

- `Drawer` — lebih umum, digunakan Shadcn/ui, Radix, MUI
- `Sheet` — digunakan Shadcn/ui khusus untuk full-height side panels

Untuk doc page: update breadcrumb dari `Overlay > Modal` → `Overlay > Drawer`,
dan perbarui semua contoh penggunaan. Ini breaking change kecil — hanya
menyentuh doc pages dan nama file.

---

## 3. Animasi yang Direncanakan

### 3a. Page Transitions

**Masalah saat ini:** Pindah halaman langsung snap tanpa transisi.

**Rekomendasi: View Transitions API (native, tanpa library)**

```ts
// Bungkus navigasi dengan startViewTransition
document.startViewTransition(() => {
  flushSync(() => navigate(to));
});
```

Keunggulan:
- Zero dependency
- Browser handle semua: cross-fade antar halaman otomatis
- Bisa di-customize via CSS `::view-transition-old` dan `::view-transition-new`
- Supported: Chrome 111+, Edge 111+, Safari 18+ — cukup untuk modern app

CSS tambahan di `index.css`:

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

Efeknya: halaman lama fade+slide up keluar, halaman baru fade+slide in
dari bawah. Subtle, tidak distracting.

**Fallback (browser tidak support):** Tidak ada — navigasi tetap normal
snap tanpa error.

**Untuk Next.js App Router:** Gunakan `useRouter` dengan wrapper serupa,
atau tunggu Next.js built-in support View Transitions yang sedang
dikembangkan.

---

### 3b. Dialog Animation

**Masalah saat ini:** Dialog muncul tiba-tiba (`if (!open) return null`
langsung unmount, tidak ada exit animation).

**Approach: mount-based dengan CSS state classes**

Ubah dari `if (!open) return null` menjadi tetap mounted tapi dengan
visibility state:

```
open: true  → data-state="open"  → animate in
open: false → data-state="closed" → animate out → unmount setelah delay
```

**Animasi yang tepat untuk Dialog:**

```
Enter: opacity 0→1 + scale 95%→100% (fade + scale up dari center)
Exit:  opacity 1→0 + scale 100%→95% (fade + scale down)
Duration: 200ms ease-out (masuk), 150ms ease-in (keluar)
```

Ini adalah pattern standar untuk center overlays — terasa "muncul" dari
titik tengah, bukan datang dari arah tertentu.

Tailwind classes (dengan plugin `tailwindcss-animate`):

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

Atau tanpa plugin (pure CSS via `@keyframes` di global CSS):

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

AlertDialog sudah menggunakan Dialog secara internal (via `createPortal`
langsung, bukan komposisi dengan Dialog). Animasi yang sama berlaku:

```
Enter: fade + scale 95%→100%
Exit:  scale 100%→95% + fade
```

Tambahan khusus AlertDialog: animasi icon (warning/destructive) bisa
diberi `delay-75` agar muncul sedikit setelah panel — memberikan emphasis
pada icon.

---

### 3d. Modal (Drawer) Animation — Fix Sekaligus Animasi

Ini fix bug sekaligus tambah animasi. Ubah approach dari "apply enter
class langsung" menjadi "transition dari enter ke translate-x-0".

**Animasi yang tepat untuk Drawer:**

```
Enter: slide in dari kanan/kiri (translate-x-full → translate-x-0)
Exit:  slide out ke kanan/kiri (translate-x-0 → translate-x-full)
Backdrop: fade in/out bersamaan
Duration: 300ms ease (lebih lambat dari Dialog — panel lebih besar)
```

```tsx
// Panel class berdasarkan state
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

Penting: dengan approach ini komponen tidak boleh return null langsung —
harus tetap mounted selama animasi exit berlangsung (gunakan `useTimeout`
atau `onTransitionEnd` sebelum unmount).

---

### 3e. Tabs Animation

**Masalah saat ini:** Konten tab berganti secara instan.

**Dua animasi yang perlu dipertimbangkan:**

**1. Indicator/underline animation** (untuk variant `underline`):

Daripada underline langsung "lompat" ke tab aktif, gunakan `transition`
pada posisi indicator. Implementasinya perlu mengukur posisi trigger
aktif dan menggerakkan absolute-positioned indicator bar:

```tsx
// Pakai ref untuk ukur posisi trigger aktif
// Gerakkan indicator dengan transform: translateX(measuredLeft)
// transition: transform 200ms ease
```

**2. Content fade transition:**

```
Exit:  opacity 1→0, duration 100ms
Enter: opacity 0→1, duration 150ms
```

Content lama fade out, content baru fade in. Keduanya tidak perlu
overlap — sequential fade sudah cukup smooth.

Approach tanpa `key` prop (avoid unmount/remount):

```tsx
// Semua TabsContent tetap di DOM, visibilitas dikontrol CSS
// data-[state=active]: opacity-100, pointer-events-auto
// data-[state=inactive]: opacity-0, pointer-events-none, absolute
```

---

## 4. Prioritas Implementasi

| # | Item | Urgency | Effort |
|---|---|---|---|
| 1 | **Fix Modal bug** | Blocker | Kecil — hanya perbaiki class logic |
| 2 | **Dialog animation** | Tinggi | Sedang — perlu state machine |
| 3 | **AlertDialog animation** | Tinggi | Kecil — ikuti Dialog |
| 4 | **Rename Modal → Drawer** | Sedang | Sedang — rename file + doc pages |
| 5 | **Tabs content fade** | Sedang | Kecil |
| 6 | **Page transitions** | Sedang | Kecil — View Transitions API |
| 7 | **Tabs indicator animation** | Rendah | Besar — perlu DOM measurement |

---

## 5. Keputusan Arsitektur

### Pakai library animasi atau tidak?

**Rekomendasi: tidak perlu Framer Motion untuk scope ini.**

Semua animasi di atas bisa dilakukan dengan:
- CSS transitions + Tailwind classes
- Native View Transitions API
- Satu helper hook `useAnimatedMount` (delay unmount saat close)

Framer Motion worth it kalau ada kebutuhan: drag, spring physics, layout
animations, gesture-based interactions. Untuk overlay open/close dan page
transitions, CSS sudah cukup dan hasilnya lebih ringan (+47KB bundle
Framer Motion vs 0KB CSS).

### Plugin tailwindcss-animate?

Opsional. Plugin ini (dipakai shadcn/ui) menambahkan classes seperti
`animate-in`, `fade-in-0`, `zoom-in-95`, dll. Tanpa plugin, kita bisa
define `@keyframes` di global CSS dan apply langsung. Pertimbangkan
install kalau kita mau konsisten dengan shadcn/ui ecosystem.

---

## 6. Hook Pattern — `useAnimatedMount`

Semua overlay (Dialog, Modal, AlertDialog) butuh pattern yang sama:
"tetap mounted selama exit animation, unmount setelah selesai."

```ts
function useAnimatedMount(open: boolean, duration = 300) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Satu frame delay agar browser paint dulu sebelum animate
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), duration);
      return () => clearTimeout(t);
    }
  }, [open, duration]);

  return { mounted, visible };
}

// Usage di Dialog:
const { mounted, visible } = useAnimatedMount(open);
if (!mounted) return null;
// visible → data-state="open" | "closed"
```

`mounted` mengontrol apakah komponen ada di DOM.
`visible` mengontrol apakah kelas animasi "terbuka" aktif.
