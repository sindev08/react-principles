interface SectionHeadingProps {
  number: number;
  title: string;
}

export function SectionHeading({ number, title }: SectionHeadingProps) {
  const label = String(number).padStart(2, "0");

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
        <span className="text-sm font-bold">{label}</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );
}
