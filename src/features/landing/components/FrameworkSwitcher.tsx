"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function FrameworkSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const isNextjs = pathname.startsWith("/nextjs/");
  const isVitejs = pathname.startsWith("/vitejs/");
  const isFrameworkRoute = isNextjs || isVitejs;

  const switchTo = (framework: "nextjs" | "vitejs") => {
    if (isNextjs) {
      router.push(pathname.replace("/nextjs/", `/${framework}/`));
    } else if (isVitejs) {
      router.push(pathname.replace("/vitejs/", `/${framework}/`));
    }
  };

  if (!isFrameworkRoute) {
    return (
      <Link
        href="/nextjs/cookbook"
        className="text-sm font-medium transition-colors hover:text-primary text-slate-600 dark:text-slate-400"
      >
        Cookbook
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] p-1">
      <button
        onClick={() => switchTo("nextjs")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
          isNextjs
            ? "bg-white dark:bg-[#0d1117] text-primary shadow-xs"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
      >
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.052.54-.052.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
        </svg>
        Next.js
      </button>
      <button
        onClick={() => switchTo("vitejs")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
          isVitejs
            ? "bg-white dark:bg-[#0d1117] text-primary shadow-xs"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
      >
        <svg className="h-3 w-3" viewBox="0 0 410 404" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M399.641 59.5246L215.643 388.545C211.844 395.338 202.084 395.378 198.228 388.618L10.5817 59.5563C6.38087 52.1896 12.6802 43.2665 21.0281 44.7586L205.223 77.6824C206.398 77.8924 207.601 77.8924 208.776 77.6824L389.119 44.8529C397.439 43.3424 403.768 52.2081 399.641 59.5246Z" fill="url(#paint0_linear)"/>
          <path d="M292.965 1.5744L156.801 28.2552C154.563 28.6937 152.906 30.5903 152.771 32.8664L144.395 174.33C144.198 177.662 147.258 180.248 150.51 179.498L188.42 170.749C191.967 169.931 195.172 172.871 194.839 176.498L182.432 309.16C182.068 313.136 187.258 315.172 189.546 311.955L199.333 298.232L324.637 38.7294C326.733 34.4829 323.26 29.6591 318.602 30.4171L279.241 36.8124C275.849 37.3676 272.719 34.8875 272.415 31.4627L269.738 4.72701C269.404 1.1335 265.868 -1.23683 262.483 0.623737L292.965 1.5744Z" fill="url(#paint1_linear)"/>
          <defs>
            <linearGradient id="paint0_linear" x1="6.00017" y1="32.9999" x2="235" y2="344" gradientUnits="userSpaceOnUse">
              <stop stopColor="#41D1FF"/>
              <stop offset="1" stopColor="#BD34FE"/>
            </linearGradient>
            <linearGradient id="paint1_linear" x1="194.651" y1="8.81818" x2="236.076" y2="292.989" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF3E00"/>
              <stop offset="1" stopColor="#FFA800"/>
            </linearGradient>
          </defs>
        </svg>
        Vite
      </button>
    </div>
  );
}
