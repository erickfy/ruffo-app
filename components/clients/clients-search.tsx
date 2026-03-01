"use client";

import { SearchBar, HighlightedText } from "@/components/ui/search-bar";

type ClientSearchItem = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
};

type ClientsSearchProps = {
  clients: ClientSearchItem[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
};

export function ClientsSearch({
  clients,
  selectedClientId,
  onSelectClient,
}: ClientsSearchProps) {
  return (
    <SearchBar
      data={clients}
      value={selectedClientId}
      onSelect={onSelectClient}
      placeholder="Buscar por nombre, teléfono o email"
      emptyMessage="No se encontraron clientes"
      searchKeys={["full_name", "phone", "email"]}
      itemKey="id"
      displayValue={(client) => client.full_name}
      renderItem={(client, isSelected, query) => (
        <div className="flex w-full items-center justify-between gap-4">
          <div className="min-w-0">
            <p
              className={`truncate font-medium ${
                isSelected ? "text-zinc-900" : "text-zinc-900"
              }`}
            >
              <HighlightedText text={client.full_name} query={query} />
            </p>

            {client.email ? (
              <p className="truncate text-xs text-zinc-500">
                <HighlightedText text={client.email} query={query} />
              </p>
            ) : null}
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm text-zinc-600">
              <HighlightedText text={client.phone} query={query} />
            </p>
          </div>
        </div>
      )}
      className="w-full"
    />
  );
}
