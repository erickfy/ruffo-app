import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";

import { PetForm } from "@/components/pets/pet-form";

const {
  pushMock,
  refreshMock,
  insertMock,
  toastSuccessMock,
  toastErrorMock,
  showFormErrorsToastMock,
} = vi.hoisted(() => ({
  pushMock: vi.fn(),
  refreshMock: vi.fn(),
  insertMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
  showFormErrorsToastMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

vi.mock("@/lib/forms/show-form-errors-toast", () => ({
  showFormErrorsToast: showFormErrorsToastMock,
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      insert: insertMock,
    }),
  }),
}));

describe("PetForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza campos y botón", () => {
    render(<PetForm clientId="client-123" />);

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/especie/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/raza/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/notas de comportamiento/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /guardar mascota/i }),
    ).toBeInTheDocument();
  });

  it("permite escribir en los campos", async () => {
    const user = userEvent.setup();

    render(<PetForm clientId="client-123" />);

    await user.type(screen.getByLabelText(/nombre/i), "Luna");
    await user.type(screen.getByLabelText(/raza/i), "Poodle");
    await user.type(
      screen.getByLabelText(/notas de comportamiento/i),
      "Nerviosa al inicio",
    );

    expect(screen.getByLabelText(/nombre/i)).toHaveValue("Luna");
    expect(screen.getByLabelText(/raza/i)).toHaveValue("Poodle");
    expect(screen.getByLabelText(/notas de comportamiento/i)).toHaveValue(
      "Nerviosa al inicio",
    );
  });

  it("envía los datos correctos y redirige al detalle cuando el guardado es exitoso", async () => {
    const user = userEvent.setup();

    insertMock.mockResolvedValue({
      error: null,
    });

    render(<PetForm clientId="client-123" />);

    await user.type(screen.getByLabelText(/nombre/i), "Luna");
    await user.type(screen.getByLabelText(/raza/i), "Poodle");
    await user.type(
      screen.getByLabelText(/notas de comportamiento/i),
      "Nerviosa al inicio",
    );

    await user.click(screen.getByRole("button", { name: /guardar mascota/i }));

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledWith({
        client_id: "client-123",
        name: "Luna",
        species: "canino",
        breed: "Poodle",
        behavior_notes: "Nerviosa al inicio",
      });
    });

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/clientes/client-123");
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  it("convierte breed y behavior_notes vacíos a null", async () => {
    const user = userEvent.setup();

    insertMock.mockResolvedValue({
      error: null,
    });

    render(<PetForm clientId="client-123" />);

    await user.type(screen.getByLabelText(/nombre/i), "Milo");

    await user.click(screen.getByRole("button", { name: /guardar mascota/i }));

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledWith({
        client_id: "client-123",
        name: "Milo",
        species: "canino",
        breed: null,
        behavior_notes: null,
      });
    });
  });

  it("muestra toast de error y mensaje root si falla el guardado", async () => {
    const user = userEvent.setup();

    insertMock.mockResolvedValue({
      error: { message: "db error" },
    });

    render(<PetForm clientId="client-123" />);

    await user.type(screen.getByLabelText(/nombre/i), "Luna");
    await user.click(screen.getByRole("button", { name: /guardar mascota/i }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalled();
    });

    expect(
      screen.getByText(/no se pudo registrar la mascota/i),
    ).toBeInTheDocument();

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("dispara showFormErrorsToast si el formulario es inválido", async () => {
    const user = userEvent.setup();

    render(<PetForm clientId="client-123" />);

    await user.click(screen.getByRole("button", { name: /guardar mascota/i }));

    await waitFor(() => {
      expect(showFormErrorsToastMock).toHaveBeenCalled();
    });

    expect(insertMock).not.toHaveBeenCalled();
  });
});
