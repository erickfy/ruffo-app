import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PetForm } from "@/components/pets/pet-form";

export const dynamic = "force-dynamic";

type NuevaMascotaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NuevaMascotaPage({
  params,
}: NuevaMascotaPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  //  Se deja a que proxy.ts maneje la redirección
  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();

  //   if (!user) {
  //     redirect("/login");
  //   }

  const { data: client, error } = await supabase
    .from("clients")
    .select("id, full_name")
    .eq("id", id)
    .single();

  if (error || !client) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              href={`/clientes/${id}`}
              className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al cliente
            </Link>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              Nueva mascota
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Cliente: {client.full_name}
            </p>
          </div>
        </div>

        <PetForm clientId={id} />
      </section>
    </main>
  );
}
