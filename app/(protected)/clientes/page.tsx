import Link from "next/link";
import { redirect } from "next/navigation";
import { PawPrint, Users, Sparkles, ChevronRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/logout-button";
import { ClientsListSection } from "@/components/clients/clients-list-section";

type Client = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
};

type Pet = {
  id: string;
  client_id: string;
};

export default async function ClientesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: clients, error: clientsError } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: pets, error: petsError } = await supabase
    .from("pets")
    .select("id, client_id");

  if (clientsError || petsError) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#faf7ff_0%,#f8fafc_38%,#eef2ff_70%,#ffffff_100%)] px-4 py-10">
        <section className="mx-auto max-w-7xl rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-950">Clientes</h1>
              <p className="text-sm text-red-600">
                Ocurrió un error al cargar los datos.
              </p>
            </div>

            <LogoutButton />
          </div>
        </section>
      </main>
    );
  }

  const typedClients: Client[] = clients ?? [];
  const typedPets: Pet[] = pets ?? [];

  const clientsWithPetsCount = typedClients.map((client) => {
    const petsCount = typedPets.filter(
      (pet) => pet.client_id === client.id,
    ).length;

    return {
      ...client,
      pets_count: petsCount,
    };
  });

  const totalClients = clientsWithPetsCount.length;
  const totalPets = typedPets.length;
  const clientsWithPets = clientsWithPetsCount.filter(
    (client) => client.pets_count > 0,
  ).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#faf7ff_0%,#f8fafc_38%,#eef2ff_70%,#ffffff_100%)] px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[8%] h-64 w-64 rounded-full bg-fuchsia-200/30 blur-3xl" />
        <div className="absolute right-[10%] top-[16%] h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/80 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700">
                <Sparkles className="h-3.5 w-3.5" />
                Módulo de clientes
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                  Gestión de clientes y mascotas
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
                  Visualiza clientes registrados, revisa sus mascotas asociadas
                  y mantén una operación clara desde una sola vista.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/clientes/nuevo"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#09090b_0%,#27272a_50%,#111827_100%)] px-5 text-sm font-medium text-white shadow-[0_16px_35px_-16px_rgba(0,0,0,0.65)] transition hover:opacity-95"
                >
                  Agregar cliente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>

                <LogoutButton />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-[24px] border border-zinc-200/80 bg-zinc-50/80 p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Clientes
                </p>
                <p className="mt-2 text-3xl font-semibold text-zinc-950">
                  {totalClients}
                </p>
                <p className="mt-1 text-sm text-zinc-500">registros totales</p>
              </div>

              <div className="rounded-[24px] border border-zinc-200/80 bg-zinc-50/80 p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                  <PawPrint className="h-5 w-5" />
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Mascotas
                </p>
                <p className="mt-2 text-3xl font-semibold text-zinc-950">
                  {totalPets}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  asociadas a clientes
                </p>
              </div>

              <div className="rounded-[24px] border border-zinc-200/80 bg-zinc-50/80 p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Con mascotas
                </p>
                <p className="mt-2 text-3xl font-semibold text-zinc-950">
                  {clientsWithPets}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  clientes vinculados
                </p>
              </div>
            </div>
          </div>
        </div>

        <ClientsListSection clients={clientsWithPetsCount} />
      </section>
    </main>
  );
}
