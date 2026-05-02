import type { Meta, StoryObj } from "@storybook/react";
import { InputOTP } from "./InputOTP";
import { StorySurface } from "./storybook-utils";
import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

function OTPControllerWithError() {
  const [value, setValue] = useState(["1", "2", "3", "", "", ""]);
  return (
    <InputOTP
      value={value}
      onChange={setValue}
      error="Invalid code. Please try again."
    />
  );
}

function OTPControllerDisabled() {
  const [value, setValue] = useState(["1", "2", "3", "4", "5", "6"]);
  return (
    <InputOTP
      value={value}
      onChange={setValue}
      disabled
    />
  );
}

function OTPControllerAutoFocus() {
  const [value, setValue] = useState(["", "", "", "", "", ""]);
  return (
    <InputOTP
      value={value}
      onChange={setValue}
      autoFocus
      onComplete={(code) => console.warn("OTP complete:", code)}
    />
  );
}

function CompleteExampleController() {
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
    <StorySurface className="w-[420px] space-y-6">
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
    </StorySurface>
  );
}

// ─── Stories ───────────────────────────────────────────────────────────────────

const meta = {
  title: "UI/InputOTP",
  component: InputOTP,
  args: {
    length: 6,
    value: ["", "", "", "", "", ""],
    onChange: () => {},
    onComplete: () => {},
  },
  render: function RenderStory(args) {
    const [value, setValue] = useState(args.value);
    return (
      <StorySurface className="w-[420px] space-y-4">
        <InputOTP {...args} value={value} onChange={setValue} />
      </StorySurface>
    );
  },
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FourDigit: Story = {
  args: {
    length: 4,
    value: ["", "", "", ""],
  },
};

export const EightDigit: Story = {
  args: {
    length: 8,
    value: ["", "", "", "", "", "", "", ""],
  },
};

export const WithError: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <OTPControllerWithError />
    </StorySurface>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <OTPControllerDisabled />
    </StorySurface>
  ),
};

export const AutoFocus: Story = {
  render: () => (
    <StorySurface className="w-[420px] space-y-4">
      <OTPControllerAutoFocus />
    </StorySurface>
  ),
};

export const CompleteExample: Story = {
  render: () => <CompleteExampleController />,
};
