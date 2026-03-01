"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const normalizeString = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function HighlightedText({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  if (!query || !text) {
    return <span className={className}>{text}</span>;
  }

  const normalizedText = normalizeString(text);
  const normalizedQuery = normalizeString(query);

  if (!normalizedText.includes(normalizedQuery)) {
    return <span className={className}>{text}</span>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = normalizedText.indexOf(normalizedQuery);

  while (matchIndex !== -1) {
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    const matchEnd = matchIndex + normalizedQuery.length;

    parts.push(
      <span
        key={matchIndex}
        className="font-semibold underline decoration-zinc-400 decoration-2 underline-offset-2"
      >
        {text.slice(matchIndex, matchEnd)}
      </span>,
    );

    lastIndex = matchEnd;
    matchIndex = normalizedText.indexOf(normalizedQuery, lastIndex);
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}

type SearchBarProps<T> = {
  data: T[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  searchKeys: (keyof T)[];
  itemKey: keyof T;
  displayValue: (item: T) => string;
  renderItem: (item: T, isSelected: boolean, query: string) => React.ReactNode;
  className?: string;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

export function SearchBar<T>({
  data,
  value,
  onSelect,
  placeholder = "Buscar...",
  emptyMessage = "No se encontraron resultados",
  searchKeys,
  itemKey,
  displayValue,
  renderItem,
  className,
}: SearchBarProps<T>) {
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] =
    React.useState<DropdownPosition | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (value) {
      const selectedItem = data.find((item) => String(item[itemKey]) === value);
      if (selectedItem) {
        setQuery(displayValue(selectedItem));
      }
    } else {
      setQuery("");
    }
  }, [value, data, itemKey, displayValue]);

  const filteredData = React.useMemo(() => {
    if (!query.trim()) return data;

    const normalizedQuery = normalizeString(query);
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);

    return data.filter((item) => {
      const searchableText = normalizeString(
        searchKeys.map((key) => String(item[key] ?? "")).join(" "),
      );

      return terms.every((term) => searchableText.includes(term));
    });
  }, [data, query, searchKeys]);

  React.useEffect(() => {
    setFocusedIndex(0);
  }, [filteredData]);

  React.useEffect(() => {
    if (isOpen && listRef.current) {
      const activeItem = listRef.current.children[focusedIndex] as
        | HTMLElement
        | undefined;

      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex, isOpen]);

  const updateDropdownPosition = React.useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    updateDropdownPosition();

    const handleWindowChange = () => {
      updateDropdownPosition();
    };

    window.addEventListener("resize", handleWindowChange);
    window.addEventListener("scroll", handleWindowChange, true);

    return () => {
      window.removeEventListener("resize", handleWindowChange);
      window.removeEventListener("scroll", handleWindowChange, true);
    };
  }, [isOpen, updateDropdownPosition]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (containerRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;

      setIsOpen(false);

      if (value) {
        const selectedItem = data.find(
          (item) => String(item[itemKey]) === value,
        );
        if (selectedItem) {
          setQuery(displayValue(selectedItem));
        }
      } else {
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, data, itemKey, displayValue]);

  function handleSelect(item: T) {
    onSelect(String(item[itemKey]));
    setQuery(displayValue(item));
    setIsOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect("");
    setQuery("");
    setIsOpen(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      updateDropdownPosition();
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
        requestAnimationFrame(updateDropdownPosition);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredData.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredData[focusedIndex]) {
          handleSelect(filteredData[focusedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  }

  const dropdown =
    mounted && isOpen && dropdownPosition
      ? createPortal(
          <div
            ref={listRef}
            className="max-h-80 overflow-auto rounded-xl border border-zinc-200 bg-white p-1.5 shadow-2xl"
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 9999,
            }}
          >
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-sm text-zinc-500">
                <Search className="h-8 w-8 opacity-20" />
                <span>{emptyMessage}</span>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredData.map((item, index) => {
                  const isSelected = String(item[itemKey]) === value;
                  const isFocused = index === focusedIndex;

                  return (
                    <div
                      key={String(item[itemKey])}
                      className={cn(
                        "flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm transition-colors",
                        isSelected
                          ? "bg-zinc-100 text-zinc-900"
                          : "text-zinc-700",
                        isFocused && !isSelected && "bg-zinc-50",
                      )}
                      onMouseEnter={() => setFocusedIndex(index)}
                      onClick={() => handleSelect(item)}
                    >
                      <div className="flex-1">
                        {renderItem(item, isSelected, query)}
                      </div>

                      {isSelected ? (
                        <Check className="ml-2 h-4 w-4 text-zinc-900" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div ref={containerRef} className={cn("relative w-full", className)}>
        <div
          className={cn(
            "flex h-11 w-full items-center rounded-xl border bg-white px-3 text-sm shadow-sm transition-all",
            isOpen
              ? "border-zinc-900 ring-2 ring-zinc-200"
              : "border-zinc-200 hover:border-zinc-300",
          )}
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
            requestAnimationFrame(updateDropdownPosition);
          }}
        >
          <Search
            className={cn(
              "mr-2 h-4 w-4 transition-colors",
              isOpen ? "text-zinc-900" : "text-zinc-400",
            )}
          />

          <input
            ref={inputRef}
            value={query}
            placeholder={placeholder}
            className="h-full w-full border-none bg-transparent outline-none placeholder:text-zinc-400"
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              requestAnimationFrame(updateDropdownPosition);
            }}
            onFocus={() => {
              setIsOpen(true);
              requestAnimationFrame(updateDropdownPosition);
            }}
            onKeyDown={handleKeyDown}
          />

          {value && query ? (
            <button
              type="button"
              onClick={handleClear}
              className="ml-2 rounded-full p-1 transition-colors hover:bg-zinc-100"
            >
              <X className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          ) : (
            <ChevronDown
              className={cn(
                "ml-2 h-4 w-4 text-zinc-400 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          )}
        </div>
      </div>

      {dropdown}
    </>
  );
}
