import Image from "next/image";
import Link from "next/link";
import { SearchX, ArrowLeft, PawPrint } from "lucide-react";

export default function NotFoundPage() {
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

            <div className="rounded-[28px] border-zinc-200/80 bg-white/90 p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-sm">
                <SearchX className="h-7 w-7" />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Error 404
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                  Recurso no encontrado
                </h2>

                <p className="text-sm leading-6 text-zinc-500 sm:text-base">
                  La página que intentas abrir no existe, fue movida o ya no
                  está disponible dentro de Ruffo App.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/clientes"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  Ir a clientes
                </Link>

                <Link
                  href="/login"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al login
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative hidden lg:block">
          <div className="absolute inset-0">
            <Image
              src="/not-found-dog.png"
              alt="Perro en una peluquería canina"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,24,27,0.10)_0%,rgba(24,24,27,0.42)_100%)]" />

          <div className="absolute left-8 top-8 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            Ruffo Experience
          </div>

          <div className="absolute bottom-8 left-8 right-8">
            <div className="max-w-md rounded-[28px] border border-white/20 bg-white/12 p-6 text-white shadow-2xl backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.20em] text-white/70">
                Navegación
              </p>
              <h3 className="mt-3 text-3xl font-semibold leading-tight">
                A veces hasta los mejores perritos se pierden.
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Regresa al módulo principal y continúa gestionando clientes y
                mascotas sin perder el contexto.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
