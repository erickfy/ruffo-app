import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";

import { LoginForm } from "@/components/auth/login-form";

const pushMock = vi.fn();
const refreshMock = vi.fn();
const signInWithPasswordMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: signInWithPasswordMock,
    },
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza campos y botón", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ingresar|entrar/i }),
    ).toBeInTheDocument();
  });

  it("permite escribir email y contraseña", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "12345678");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("12345678");
  });

  it("envía credenciales al hacer submit", async () => {
    const user = userEvent.setup();
    signInWithPasswordMock.mockResolvedValue({ error: null });

    render(<LoginForm />);

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@example.com",
    );
    await user.type(screen.getByLabelText(/contraseña/i), "12345678");
    await user.click(screen.getByRole("button", { name: /ingresar|entrar/i }));

    await waitFor(() => {
      expect(signInWithPasswordMock).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "12345678",
      });
    });
  });

  it("trimmea el email antes de enviarlo", async () => {
    const user = userEvent.setup();
    signInWithPasswordMock.mockResolvedValue({ error: null });

    render(<LoginForm />);

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "   test@example.com   ",
    );
    await user.type(screen.getByLabelText(/contraseña/i), "12345678");
    await user.click(screen.getByRole("button", { name: /ingresar|entrar/i }));

    await waitFor(() => {
      expect(signInWithPasswordMock).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "12345678",
      });
    });
  });

  it("muestra error si Supabase devuelve credenciales inválidas", async () => {
    const user = userEvent.setup();
    signInWithPasswordMock.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });

    render(<LoginForm />);

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@example.com",
    );
    await user.type(screen.getByLabelText(/contraseña/i), "12345678");
    await user.click(screen.getByRole("button", { name: /ingresar|entrar/i }));

    expect(
      await screen.findByText(/credenciales inválidas/i),
    ).toBeInTheDocument();

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("redirige a /clientes cuando el login es exitoso", async () => {
    const user = userEvent.setup();
    signInWithPasswordMock.mockResolvedValue({ error: null });

    render(<LoginForm />);

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@example.com",
    );
    await user.type(screen.getByLabelText(/contraseña/i), "12345678");
    await user.click(screen.getByRole("button", { name: /ingresar|entrar/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/clientes");
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  it("deshabilita el botón mientras se procesa el login", async () => {
    const user = userEvent.setup();

    let resolvePromise: (value: { error: null }) => void = () => {};
    signInWithPasswordMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(<LoginForm />);

    const button = screen.getByRole("button", { name: /ingresar|entrar/i });

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "test@example.com",
    );
    await user.type(screen.getByLabelText(/contraseña/i), "12345678");
    await user.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByText(/ingresando/i)).toBeInTheDocument();

    resolvePromise({ error: null });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/clientes");
    });
  });
  it("permite mostrar y ocultar la contraseña", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const passwordInput = screen.getByLabelText(/contraseña/i);
    const toggleButton = screen.getByRole("button", {
      name: /mostrar contraseña|mostrar clave/i,
    });

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    const hideButton = screen.getByRole("button", {
      name: /ocultar contraseña|ocultar clave/i,
    });

    await user.click(hideButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
