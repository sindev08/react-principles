import { UserTable } from "@/components/examples/UserTable";

export default function TablePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">TanStack Table Example</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Sortable, filterable, and paginated table powered by TanStack Table v8.
      </p>
      <div className="mt-8">
        <UserTable />
      </div>
    </main>
  );
}
