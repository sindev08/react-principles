"use client";

import { use } from "react";
import { UserEditForm } from "@/features/examples/components/UserEditForm";

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Update user details with pre-populated form fields.
      </p>
      <div className="mt-8">
        <UserEditForm id={id} />
      </div>
    </main>
  );
}
