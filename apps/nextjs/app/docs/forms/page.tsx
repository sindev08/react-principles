"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DocsPageLayout } from "@/components/docs";
import { CodeBlock } from "@react-principles/shared/components";
import { LOGIN_CODE, SETTINGS_CODE } from "./snippets";

const TOC_ITEMS = [
  { label: "Login Example", href: "#login-form" },
  { label: "Settings Example", href: "#settings-form" },
  { label: "Validation States", href: "#validation" },
  { label: "API Reference", href: "#api" },
];

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

const settingsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bio: z.string().optional(),
  emailUpdates: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
});

type LoginValues = z.infer<typeof loginSchema>;
type SettingsValues = z.infer<typeof settingsSchema>;

export default function FormsDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Data Entry</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Form</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Form
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Forms allow users to enter data that can then be submitted for
            processing. Use forms for login, settings, registration, or any data
            collection task.
          </p>
        </div>

        {/* Login Example */}
        <section className="mb-16" id="login-form">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Login Example
            </h2>
            <a
              href="#login-form"
              className="text-sm font-medium text-primary hover:underline"
            >
              # Direct link
            </a>
          </div>
          <PreviewCodeTabs code={LOGIN_CODE} filename="LoginForm.tsx">
            <div className="flex justify-center p-8 bg-background-light dark:bg-slate-950/30 md:p-12">
              <div className="w-full max-w-sm p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
                <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Welcome Back
                </h3>
                <LoginFormDemo />
              </div>
            </div>
          </PreviewCodeTabs>
        </section>

        {/* Settings Example */}
        <section className="mb-16" id="settings-form">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Settings Example
            </h2>
            <span className="bg-primary/10 text-primary rounded px-2 py-1 text-[10px] font-bold uppercase">
              Grid Layout
            </span>
          </div>
          <PreviewCodeTabs code={SETTINGS_CODE} filename="SettingsForm.tsx">
            <div className="p-8 bg-white dark:bg-slate-900 md:p-12">
              <SettingsFormDemo />
            </div>
          </PreviewCodeTabs>
        </section>

        {/* Validation States */}
        <section className="mb-16" id="validation">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            Validation States
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-6 space-y-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div>
                <label className="block mb-2 text-sm font-semibold">Username</label>
                <div className="relative">
                  <input
                    readOnly
                    value="invalid_user!"
                    className="w-full pr-10 text-sm rounded-lg border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-900/10 focus:outline-none px-3 py-2 border"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-red-500">
                    error
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  Username contains invalid characters.
                </p>
              </div>
            </div>
            <div className="p-6 space-y-4 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div>
                <label className="block mb-2 text-sm font-semibold">
                  Success State
                </label>
                <div className="relative">
                  <input
                    readOnly
                    value="valid_user_123"
                    className="w-full pr-10 text-sm rounded-lg border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/10 focus:outline-none px-3 py-2 border"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-emerald-500">
                    check_circle
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-emerald-600">
                  Username is available!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-16" id="api">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            API Reference
          </h2>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left bg-white dark:bg-slate-900/50 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Property</th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Type</th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Default</th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider uppercase text-slate-500">Description</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="px-6 py-4 font-mono font-semibold text-primary">layout</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{"'vertical' | 'horizontal'"}</td>
                  <td className="px-6 py-4 italic text-slate-400">{"'vertical'"}</td>
                  <td className="px-6 py-4">The visual layout of label and input pairings.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-mono font-semibold text-primary">onSubmit</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{"(values) => void"}</td>
                  <td className="px-6 py-4 italic text-slate-400">undefined</td>
                  <td className="px-6 py-4">Callback triggered when the form is submitted.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-mono font-semibold text-primary">initialValues</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">object</td>
                  <td className="px-6 py-4 italic text-slate-400">{"{}"}</td>
                  <td className="px-6 py-4">Key-value pairs for initial field values.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}

function PreviewCodeTabs({
  children,
  code,
  filename,
}: {
  children: ReactNode;
  code: string;
  filename: string;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-4 px-4 py-2 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              tab === t
                ? "pt-2 pb-1 text-xs font-bold border-b-2 text-primary border-primary capitalize"
                : "pt-2 pb-1 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 capitalize"
            }
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "preview" ? (
        children
      ) : (
        <CodeBlock filename={filename} copyText={code} className="rounded-none border-0">
          {code}
        </CodeBlock>
      )}
    </div>
  );
}

function LoginFormDemo() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (_data: LoginValues) => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <span className="material-symbols-outlined text-[48px] text-emerald-500">check_circle</span>
        <p className="font-bold text-slate-900 dark:text-white">Signed in successfully!</p>
        <p className="text-sm text-slate-500">Redirecting you...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-semibold">Email Address</label>
        <input
          type="email"
          {...register("email")}
          placeholder="name@company.com"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-semibold">Password</label>
          <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot?</a>
        </div>
        <input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
      </div>
      <div className="flex items-center gap-2 py-2">
        <input type="checkbox" id="remember" {...register("rememberMe")} className="rounded text-primary border-slate-300" />
        <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400">Keep me logged in</label>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 font-bold text-white rounded-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-70"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

function SettingsFormDemo() {
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { firstName: "Jane", lastName: "Cooper", emailUpdates: true },
  });

  const onSubmit = async (_data: SettingsValues) => {
    await new Promise((r) => setTimeout(r, 400));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-slate-100 dark:divide-slate-800">
      <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Profile</h4>
          <p className="mt-1 text-xs text-slate-500">This information will be displayed publicly.</p>
        </div>
        <div className="space-y-4 md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-bold tracking-wider uppercase text-slate-500">First Name</label>
              <input type="text" {...register("firstName")} className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-primary focus:outline-none px-3 py-2" />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-xs font-bold tracking-wider uppercase text-slate-500">Last Name</label>
              <input type="text" {...register("lastName")} className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-primary focus:outline-none px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-xs font-bold tracking-wider uppercase text-slate-500">Biography</label>
            <textarea
              {...register("bio")}
              placeholder="Tell us a bit about yourself..."
              className="w-full h-24 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:border-primary focus:outline-none px-3 py-2 resize-none"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
          <p className="mt-1 text-xs text-slate-500">Decide which communications you&apos;d like to receive.</p>
        </div>
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-start gap-3">
            <input type="checkbox" id="emailUpdates" {...register("emailUpdates")} className="mt-1 rounded text-primary border-slate-300" />
            <div>
              <label htmlFor="emailUpdates" className="block text-sm font-semibold">Email updates</label>
              <span className="text-xs text-slate-500">Get notified when someone mentions you.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <input type="checkbox" id="pushNotifications" {...register("pushNotifications")} className="mt-1 rounded text-primary border-slate-300" />
            <div>
              <label htmlFor="pushNotifications" className="block text-sm font-semibold">Push notifications</label>
              <span className="text-xs text-slate-500">Receive mobile alerts for new messages.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-6">
        <button type="button" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-bold text-white rounded-lg bg-primary hover:bg-primary/90 transition-all"
        >
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
