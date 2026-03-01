import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/logout-button";
import { ClientForm } from "@/components/clients/client-form";

export default async function NuevoClientePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-lg bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm text-zinc-500">Clientes</p>
            <h1 className="text-2xl font-bold text-zinc-900">
              Registrar cliente
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/clientes"
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Volver
            </Link>

            <LogoutButton />
          </div>
        </div>

        <ClientForm />
      </section>
    </main>
  );
}
