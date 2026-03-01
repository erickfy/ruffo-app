import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  PawPrint,
  Phone,
  Plus,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/logout-button";
import { Badge } from "@/components/ui/badge";
import { DeletePetButton } from "@/components/pets/delete-pet-button";

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
  name: string;
  species: "canino" | "felino" | "otro";
  breed: string | null;
  behavior_notes: string | null;
  created_at: string;
};

type ClienteDetallePageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getSpeciesLabel(species: Pet["species"]) {
  switch (species) {
    case "canino":
      return "Canino";
    case "felino":
      return "Felino";
    default:
      return "Otro";
  }
}

export default async function ClienteDetallePage({
  params,
}: ClienteDetallePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single<Client>();

  if (clientError || !client) {
    notFound();
  }

  const { data: pets, error: petsError } = await supabase
    .from("pets")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false });

  if (petsError) {
    return (
      <main className="min-h-screen bg-zinc-50 px-4 py-10">
        <section className="mx-auto max-w-6xl rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-950">
                Detalle del cliente
              </h1>
              <p className="text-sm text-red-600">
                Ocurrió un error al cargar las mascotas.
              </p>
            </div>

            <LogoutButton />
          </div>
        </section>
      </main>
    );
  }

  const typedClient = client as Client;
  const typedPets = (pets ?? []) as Pet[];

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Link
                href="/clientes"
                className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a clientes
              </Link>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                  {typedClient.full_name}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Cliente registrado en Ruffo App
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/clientes/${typedClient.id}/mascotas/nuevo`}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar mascota
              </Link>

              <LogoutButton />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Mascotas
              </p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">
                {typedPets.length}
              </p>
            </div>

            <div className="rounded-2xl border bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Teléfono
              </p>
              <p className="mt-2 text-lg font-semibold text-zinc-950">
                {typedClient.phone}
              </p>
            </div>

            <div className="rounded-2xl border bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                Registro
              </p>
              <p className="mt-2 text-lg font-semibold text-zinc-950">
                {new Date(typedClient.created_at).toLocaleDateString("es-EC", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-zinc-950">
              Información del cliente
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border bg-zinc-50 p-4">
                <Phone className="mt-0.5 h-4 w-4 text-zinc-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    Teléfono
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-950">
                    {typedClient.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border bg-zinc-50 p-4">
                <Mail className="mt-0.5 h-4 w-4 text-zinc-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    Email
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-950 break-words">
                    {typedClient.email || "No registrado"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border bg-zinc-50 p-4">
                <CalendarDays className="mt-0.5 h-4 w-4 text-zinc-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    Fecha de registro
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-950">
                    {new Date(typedClient.created_at).toLocaleDateString(
                      "es-EC",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      },
                    )}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                  Notas
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-700 whitespace-pre-wrap break-words">
                  {typedClient.notes || "Sin notas registradas."}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                  <PawPrint className="h-3 w-3" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">
                    Mascotas
                  </h2>
                  {/* <p className="text-sm text-zinc-500">
                    Listado de mascotas vinculadas
                  </p> */}
                </div>
              </div>

              <Link
                href={`/clientes/${typedClient.id}/mascotas/nuevo`}
                className="inline-flex items-center rounded-xl border bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva mascota
              </Link>
            </div>

            {typedPets.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-zinc-50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                  <PawPrint className="h-6 w-6" />
                </div>

                <p className="text-base font-semibold text-zinc-950">
                  Sin mascotas registradas
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Agrega una mascota para completar el perfil del cliente.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {typedPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="rounded-2xl border bg-zinc-50 p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-zinc-950">
                            {pet.name}
                          </h3>

                          <Badge
                            variant="secondary"
                            className="rounded-full border bg-white px-3 py-1 text-zinc-800"
                          >
                            {getSpeciesLabel(pet.species)}
                          </Badge>

                          {pet.breed ? (
                            <Badge
                              variant="secondary"
                              className="rounded-full border bg-zinc-100 px-3 py-1 text-zinc-700"
                            >
                              {pet.breed}
                            </Badge>
                          ) : null}
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                            Notas de comportamiento
                          </p>
                          <p className="mt-2 text-sm leading-6 text-zinc-700 whitespace-pre-wrap break-words">
                            {pet.behavior_notes || "Sin notas registradas."}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-xl border bg-white px-4 py-3 text-sm">
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                          Registro
                        </p>
                        <p className="mt-2 font-medium text-zinc-950">
                          {new Date(pet.created_at).toLocaleDateString(
                            "es-EC",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <DeletePetButton petId={pet.id} petName={pet.name} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
