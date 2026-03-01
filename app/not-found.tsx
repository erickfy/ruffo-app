export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">
          Recurso no encontrado
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          El cliente solicitado no existe o no está disponible.
        </p>
      </div>
    </main>
  );
}
