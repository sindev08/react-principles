import { useRef, useEffect, type KeyboardEvent } from "react";
import { cn } from "@/shared/utils/cn";

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
    if (!/^\d$/.test(digit)) return; // Only allow digits

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
    const digits = pasteData.slice(0, length).split("").filter((d) => /^\d$/.test(d));

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

  const errorId = id ? `${id}-error` : undefined;

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
            aria-label={`Digit ${index + 1}`}
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
}
