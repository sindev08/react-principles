import { UserForm } from "@/features/examples/components/UserForm";

export default function NewUserPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">New User</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Create a user with React Hook Form and Zod validation.
      </p>
      <div className="mt-8">
        <UserForm />
      </div>
    </main>
  );
}
