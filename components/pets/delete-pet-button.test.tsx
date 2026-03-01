import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";

import { DeletePetButton } from "@/components/pets/delete-pet-button";

const { refreshMock, deleteEqMock, toastSuccessMock, toastErrorMock } =
  vi.hoisted(() => ({
    refreshMock: vi.fn(),
    deleteEqMock: vi.fn(),
    toastSuccessMock: vi.fn(),
    toastErrorMock: vi.fn(),
  }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: () => ({
      delete: () => ({
        eq: deleteEqMock,
      }),
    }),
  }),
}));

describe("DeletePetButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("abre el diálogo de confirmación", async () => {
    const user = userEvent.setup();

    render(<DeletePetButton petId="pet-123" petName="Luna" />);

    await user.click(
      screen.getByRole("button", { name: /eliminar mascota luna/i }),
    );

    expect(
      screen.getByRole("heading", { name: /^eliminar mascota$/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/¿seguro que deseas eliminar a/i),
    ).toBeInTheDocument();
  });

  it("elimina la mascota al confirmar", async () => {
    const user = userEvent.setup();

    deleteEqMock.mockResolvedValue({ error: null });

    render(<DeletePetButton petId="pet-123" petName="Luna" />);

    await user.click(
      screen.getByRole("button", { name: /eliminar mascota luna/i }),
    );
    await user.click(screen.getByRole("button", { name: /sí, eliminar/i }));

    await waitFor(() => {
      expect(deleteEqMock).toHaveBeenCalledWith("id", "pet-123");
    });

    expect(toastSuccessMock).toHaveBeenCalled();
    expect(refreshMock).toHaveBeenCalled();
  });

  it("muestra toast de error si falla la eliminación", async () => {
    const user = userEvent.setup();

    deleteEqMock.mockResolvedValue({
      error: { message: "db error" },
    });

    render(<DeletePetButton petId="pet-123" petName="Luna" />);

    await user.click(
      screen.getByRole("button", { name: /eliminar mascota luna/i }),
    );
    await user.click(screen.getByRole("button", { name: /sí, eliminar/i }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalled();
    });

    expect(refreshMock).not.toHaveBeenCalled();
  });
});
