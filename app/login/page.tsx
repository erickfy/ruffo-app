import { redirect } from "next/navigation";
import Image from "next/image";
import { PawPrint } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/clientes");
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,244,245,0.9),_transparent_45%),linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]" />

          <div className="relative z-10 w-full max-w-md">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-sm">
                <PawPrint className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Ruffo App
                </p>
                <h1 className="text-lg font-semibold text-zinc-950">
                  Grooming CRM
                </h1>
              </div>
            </div>

            <div className="mb-8 space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Bienvenido
              </h2>
              <p className="text-sm text-zinc-500 sm:text-base">
                Accede para gestionar clientes y mascotas.
              </p>
            </div>

            <LoginForm />
          </div>
        </section>

        <section className="relative hidden lg:block">
          <div className="absolute inset-0">
            <Image
              src="/login-dog.jpg"
              alt="Perro en una peluquería canina"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,24,27,0.10)_0%,rgba(24,24,27,0.38)_100%)]" />

          <div className="absolute left-8 top-8 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            Ruffo Experience
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <div className="max-w-md rounded-[28px] border border-white/20 bg-white/12 p-6 text-white shadow-2xl backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.20em] text-white/70">
                Plataforma
              </p>
              <h3 className="mt-3 text-3xl font-semibold leading-tight">
                Menos fricción. Más tiempo para cuidar mascotas.
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Una experiencia clara para registrar clientes, asociar mascotas
                y trabajar con mejor orden.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
