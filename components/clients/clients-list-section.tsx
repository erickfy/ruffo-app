"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Rows3, Search } from "lucide-react";

import { ClientsTable } from "@/components/clients/clients-table";
import { ClientsSearch } from "@/components/clients/clients-search";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ClientRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
  pets_count: number;
};

type ClientsListSectionProps = {
  clients: ClientRow[];
};

export function ClientsListSection({ clients }: ClientsListSectionProps) {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("5");

  const filteredClients = useMemo(() => {
    if (!selectedClientId) return clients;
    return clients.filter((client) => client.id === selectedClientId);
  }, [clients, selectedClientId]);

  const searchItems = useMemo(
    () =>
      clients.map((client) => ({
        id: client.id,
        full_name: client.full_name,
        phone: client.phone,
        email: client.email,
      })),
    [clients],
  );

  const pageSizeNumber = Number(pageSize);
  const totalItems = filteredClients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSizeNumber));

  useEffect(() => {
    setPage(1);
  }, [selectedClientId, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * pageSizeNumber;
    const end = start + pageSizeNumber;
    return filteredClients.slice(start, end);
  }, [filteredClients, page, pageSizeNumber]);

  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSizeNumber + 1;
  const endItem =
    totalItems === 0 ? 0 : Math.min(page * pageSizeNumber, totalItems);

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur xl:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="w-full max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Search className="h-4 w-4" />
              Buscar cliente
            </div>

            <ClientsSearch
              clients={searchItems}
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
            />
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
              <SlidersHorizontal className="h-4 w-4" />
              Mostrando{" "}
              <span className="font-medium text-zinc-900">
                {startItem}
              </span> -{" "}
              <span className="font-medium text-zinc-900">{endItem}</span> de{" "}
              <span className="font-medium text-zinc-900">{totalItems}</span>
            </div>

            <div className="inline-flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Rows3 className="h-4 w-4" />
                Filas
              </div>

              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="h-9 w-[92px] rounded-xl border-zinc-200 bg-white">
                  <SelectValue placeholder="5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <ClientsTable clients={paginatedClients} />

      <div className="flex flex-col gap-3 rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-zinc-600">
          Página <span className="font-medium text-zinc-950">{page}</span> de{" "}
          <span className="font-medium text-zinc-950">{totalPages}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages || totalItems === 0}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
