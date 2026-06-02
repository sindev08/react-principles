"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { InputOTP } from "@/ui/InputOTP";
import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-inputotp--default";

const CODE_SNIPPET = `import { InputOTP } from "@/ui/InputOTP";

function Example() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  return (
    <InputOTP
      value={otp}
      onChange={setOtp}
      onComplete={(code) => console.log("OTP:", code)}
    />
  );
}`;

const COPY_PASTE_SNIPPET = `import { useRef, useEffect, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputOTPProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
  id?: string;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InputOTP({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error,
  autoFocus = false,
  id,
  className,
}: InputOTPProps) {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Focus management
  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  };

  const focusNext = (index: number) => {
    const nextIndex = Math.min(index + 1, length - 1);
    focusInput(nextIndex);
  };

  const focusPrevious = (index: number) => {
    const prevIndex = Math.max(index - 1, 0);
    focusInput(prevIndex);
  };

  // Handle digit input
  const handleChange = (index: number, inputValue: string) => {
    const digit = inputValue.slice(-1); // Take last character
    if (!/^\\d$/.test(digit)) return; // Only allow digits

    const newValue = [...value];
    newValue[index] = digit;

    onChange(newValue);

    // Auto-advance to next slot if digit was entered
    if (digit && index < length - 1) {
      focusNext(index);
    }

    // Check if all slots are filled
    const code = newValue.join("");
    if (code.length === length && onComplete) {
      onComplete(code);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    switch (e.key) {
      case "Backspace":
        if (!value[index]) {
          // Current slot is empty, go back
          e.preventDefault();
          focusPrevious(index);
        }
        break;

      case "ArrowLeft":
        e.preventDefault();
        if (index > 0) {
          focusPrevious(index);
        }
        break;

      case "ArrowRight":
        e.preventDefault();
        if (index < length - 1) {
          focusNext(index);
        }
        break;

      case "Home":
        e.preventDefault();
        focusInput(0);
        break;

      case "End":
        e.preventDefault();
        focusInput(length - 1);
        break;

      case "Delete":
        // Clear current slot
        const newValue = [...value];
        newValue[index] = "";
        onChange(newValue);
        break;
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const digits = pasteData.slice(0, length).split("").filter((d) => /^\\d$/.test(d));

    // Create new value array with pasted digits
    const newValue = [...digits, ...Array(length - digits.length).fill("")];
    onChange(newValue);

    // Check if complete
    const code = newValue.join("");
    if (code.length === length && onComplete) {
      onComplete(code);
    }
  };

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus) {
      focusInput(0);
    }
  }, [autoFocus]);

  const errorId = id ? \`\${id}-error\` : undefined;
  const groupId = id || "otp";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* Hidden input for accessibility - announces full OTP to screen readers */}
      <input
        type="text"
        value={value.join("")}
        onChange={() => {}}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        role="group"
        aria-label="One-time password"
        aria-describedby={error ? errorId : undefined}
        className="flex items-center gap-2"
      >
        {value.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            autoFocus={index === 0 && autoFocus}
            aria-label={\`Digit \${index + 1}\`}
            className={cn(
              "w-full h-12 text-center text-lg rounded-lg border border-slate-200 dark:border-[#1f2937]",
              "bg-white dark:bg-[#0d1117]",
              "text-slate-900 dark:text-white",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "focus:outline-none",
              "focus:border-primary dark:focus:border-primary",
              "focus:ring-2 focus:ring-primary/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-400 dark:border-red-500"
            )}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
          />
        ))}
      </div>

      {error && (
        <p id={errorId} className="text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}`;

const PROPS_ROWS = [
  { prop: "length", type: "number", default: "6", description: "Number of digit slots to display." },
  { prop: "value", type: "string[]", default: "—", description: "Array of digit values (one per slot)." },
  { prop: "onChange", type: "(value: string[]) => void", default: "—", description: "Called when any digit changes." },
  { prop: "onComplete", type: "(value: string) => void", default: "—", description: "Called when all slots are filled." },
  { prop: "error", type: "string", default: "—", description: "Error message to display below the inputs." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disables all input slots." },
  { prop: "autoFocus", type: "boolean", default: "false", description: "Auto-focuses the first slot on mount." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InputOTPDocPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");

  const handleOTPComplete = (code: string) => {
    if (code === "123456") {
      setError("");
      alert("OTP verified!");
    } else {
      setError("Invalid code. Please try again.");
    }
  };

  const handlePINComplete = (code: string) => {
    if (code === "1234") {
      setError("");
      alert("PIN verified!");
    } else {
      setError("Invalid PIN. Please try again.");
    }
  };

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Data Entry</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Input OTP</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Input OTP
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A segmented input for OTP/PIN codes with individual slots per digit. Supports keyboard navigation, paste, and auto-focus advance.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Keyboard Nav", "Paste Support", "Auto-advance"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="input-otp" />

        {/* 01 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
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
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4785] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF4785]"></span>
            </span>
            <p className="flex-1 text-xs text-slate-500 dark:text-slate-400">Explore all variants and interactive states in Storybook.</p>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF4785]">
              Open Storybook
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </span>
          </a>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Two-Factor Authentication
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Enter the 6-digit code from your authenticator app.
                </p>
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleOTPComplete}
                  error={error}
                  autoFocus
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  PIN Entry
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Enter your 4-digit PIN to continue.
                </p>
                <InputOTP
                  length={4}
                  value={pin}
                  onChange={setPin}
                  onComplete={handlePINComplete}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 02 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/InputOTP.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 03 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="InputOTP.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <code className="font-mono text-xs text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code>
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
