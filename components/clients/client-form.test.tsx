import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";

import { ClientForm } from "@/components/clients/client-form";

const {
  pushMock,
  refreshMock,
  insertMock,
  selectMock,
  singleMock,
  toastSuccessMock,
  toastErrorMock,
  showFormErrorsToastMock,
} = vi.hoisted(() => ({
  pushMock: vi.fn(),
  refreshMock: vi.fn(),
  insertMock: vi.fn(),
  selectMock: vi.fn(),
  singleMock: vi.fn(),
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

describe("ClientForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    insertMock.mockReturnValue({
      select: selectMock,
    });

    selectMock.mockReturnValue({
      single: singleMock,
    });
  });

  it("renderiza campos y botón", () => {
    render(<ClientForm />);

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notas/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /guardar cliente/i }),
    ).toBeInTheDocument();
  });

  it("permite escribir en los campos", async () => {
    const user = userEvent.setup();

    render(<ClientForm />);

    await user.type(screen.getByLabelText(/nombre completo/i), "María Pérez");
    await user.type(screen.getByLabelText(/teléfono/i), "0991234567");
    await user.type(screen.getByLabelText(/^email$/i), "maria@test.com");
    await user.type(screen.getByLabelText(/notas/i), "Cliente frecuente");

    expect(screen.getByLabelText(/nombre completo/i)).toHaveValue(
      "María Pérez",
    );
    expect(screen.getByLabelText(/teléfono/i)).toHaveValue("0991234567");
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("maria@test.com");
    expect(screen.getByLabelText(/notas/i)).toHaveValue("Cliente frecuente");
  });

  it("limpia caracteres no numéricos en teléfono", async () => {
    const user = userEvent.setup();

    render(<ClientForm />);

    const phoneInput = screen.getByLabelText(/teléfono/i);
    await user.type(phoneInput, "099-abc-123x");

    expect(phoneInput).toHaveValue("099123");
  });

  it("envía los datos correctos y redirige al detalle cuando el guardado es exitoso", async () => {
    const user = userEvent.setup();

    singleMock.mockResolvedValue({
      data: { id: "client-123" },
      error: null,
    });

    render(<ClientForm />);

    await user.type(screen.getByLabelText(/nombre completo/i), "María Pérez");
    await user.type(screen.getByLabelText(/teléfono/i), "0991234567");
    await user.type(screen.getByLabelText(/^email$/i), "maria@test.com");
    await user.type(screen.getByLabelText(/notas/i), "Cliente frecuente");

    await user.click(screen.getByRole("button", { name: /guardar cliente/i }));

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledWith({
        full_name: "María Pérez",
        phone: "0991234567",
        email: "maria@test.com",
        notes: "Cliente frecuente",
      });
    });

    expect(selectMock).toHaveBeenCalledWith("id");
    expect(singleMock).toHaveBeenCalled();

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/clientes/client-123");
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  it("convierte email y notes vacíos a null", async () => {
    const user = userEvent.setup();

    singleMock.mockResolvedValue({
      data: { id: "client-123" },
      error: null,
    });

    render(<ClientForm />);

    await user.type(screen.getByLabelText(/nombre completo/i), "Juan Torres");
    await user.type(screen.getByLabelText(/teléfono/i), "0982222222");

    await user.click(screen.getByRole("button", { name: /guardar cliente/i }));

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledWith({
        full_name: "Juan Torres",
        phone: "0982222222",
        email: null,
        notes: null,
      });
    });
  });

  it("muestra toast de error y mensaje root si falla el guardado", async () => {
    const user = userEvent.setup();

    singleMock.mockResolvedValue({
      data: null,
      error: { message: "db error" },
    });

    render(<ClientForm />);

    await user.type(screen.getByLabelText(/nombre completo/i), "María Pérez");
    await user.type(screen.getByLabelText(/teléfono/i), "0991234567");

    await user.click(screen.getByRole("button", { name: /guardar cliente/i }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalled();
    });

    expect(
      screen.getByText(/no se pudo crear el cliente/i),
    ).toBeInTheDocument();

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("dispara showFormErrorsToast si el formulario es inválido", async () => {
    const user = userEvent.setup();

    render(<ClientForm />);

    await user.click(screen.getByRole("button", { name: /guardar cliente/i }));

    await waitFor(() => {
      expect(showFormErrorsToastMock).toHaveBeenCalled();
    });

    expect(insertMock).not.toHaveBeenCalled();
  });
});
