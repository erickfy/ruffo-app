"use client";

import { toast } from "sonner";
import type { FieldErrors, FieldValues } from "react-hook-form";

type FlatFormError = {
  field?: string;
  message: string;
};

function flattenErrors(
  errors: FieldErrors<FieldValues>,
  path = "",
): FlatFormError[] {
  const result: FlatFormError[] = [];

  for (const [key, value] of Object.entries(errors)) {
    if (!value) continue;

    const fieldPath = path ? `${path}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      const maybeMessage =
        "message" in value && typeof value.message === "string"
          ? value.message
          : null;

      if (maybeMessage) {
        result.push({
          field: key === "root" ? undefined : fieldPath,
          message: maybeMessage,
        });
      }

      const nested = flattenErrors(
        value as FieldErrors<FieldValues>,
        fieldPath,
      );
      result.push(...nested);
    }
  }

  return result;
}

function focusField(field?: string) {
  if (!field) return;

  const element =
    document.querySelector<HTMLElement>(`#${CSS.escape(field)}`) ??
    document.querySelector<HTMLElement>(`[name="${CSS.escape(field)}"]`);

  if (!element) return;

  element.scrollIntoView({ behavior: "smooth", block: "center" });

  requestAnimationFrame(() => {
    element.focus({ preventScroll: true });
    element.classList.add("ring-2", "ring-red-500", "ring-offset-2");

    setTimeout(() => {
      element.classList.remove("ring-2", "ring-red-500", "ring-offset-2");
    }, 1600);
  });
}

export function showFormErrorsToast<T extends FieldValues>(
  errors: FieldErrors<T>,
  title = "Errores en el formulario",
) {
  const flatErrors = flattenErrors(
    errors as unknown as FieldErrors<FieldValues>,
  ).filter((error, index, array) => {
    return (
      error.message &&
      array.findIndex(
        (item) => item.field === error.field && item.message === error.message,
      ) === index
    );
  });

  if (!flatErrors.length) return;

  const first = flatErrors[0];
  const shown = flatErrors.slice(0, 5);

  toast.error(title, {
    description: (
      <div className="space-y-2">
        {shown.map((error, index) => (
          <button
            key={`${error.field ?? "general"}-${index}`}
            type="button"
            className="block w-full text-left text-sm hover:underline"
            onClick={() => focusField(error.field)}
          >
            • {error.message}
          </button>
        ))}

        {flatErrors.length > shown.length ? (
          <p className="text-sm opacity-90">
            Y {flatErrors.length - shown.length} error(es) más.
          </p>
        ) : null}
      </div>
    ),
  });

  focusField(first.field);
}
