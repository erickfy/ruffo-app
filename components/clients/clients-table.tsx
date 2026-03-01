import Link from "next/link";
import { Mail, Phone, PawPrint, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ClientRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
  pets_count: number;
};

type ClientsTableProps = {
  clients: ClientRow[];
};

export function ClientsTable({ clients }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="rounded-[28px] border border-white/70 bg-white/85 p-10 text-center shadow-sm backdrop-blur">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
          <PawPrint className="h-6 w-6" />
        </div>

        <p className="text-base font-semibold text-zinc-950">
          No se encontraron clientes
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Intenta ajustar la búsqueda o registra un nuevo cliente para
          continuar.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-white/70 bg-white/88 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.15)] backdrop-blur">
      <div className="overflow-hidden rounded-[28px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/80 hover:bg-zinc-50/80">
              <TableHead className="h-14 pl-6">Cliente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Mascotas</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead className="pr-6 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="group hover:bg-zinc-50/70">
                <TableCell className="pl-6">
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-950">
                      {client.full_name}
                    </span>

                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{client.email || "Sin email registrado"}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700">
                    <Phone className="h-3.5 w-3.5" />
                    {client.phone}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="secondary"
                    className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-zinc-800"
                  >
                    {client.pets_count} mascota
                    {client.pets_count === 1 ? "" : "s"}
                  </Badge>
                </TableCell>

                <TableCell className="text-zinc-600">
                  <div className="flex flex-col">
                    <span>
                      {new Date(client.created_at).toLocaleDateString("es-EC", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                    <span className="text-xs text-zinc-400">
                      alta del cliente
                    </span>
                  </div>
                </TableCell>

                <TableCell className="pr-6 text-right">
                  <Link
                    href={`/clientes/${client.id}`}
                    className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
                  >
                    Ver detalle
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
