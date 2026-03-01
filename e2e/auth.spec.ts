import { test, expect } from "@playwright/test";
import {
  TEST_EMAIL,
  TEST_PASSWORD,
  assertTestCredentials,
} from "./utils/test-credentials";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Auth flow", () => {
  test.beforeEach(() => {
    assertTestCredentials();
  });

  test("redirige desde / hacia /login cuando no hay sesión", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("heading", { name: /bienvenido/i }),
    ).toBeVisible();
  });

  test("permite iniciar sesión correctamente", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/correo electrónico/i).fill(TEST_EMAIL);
    await page.locator("#password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /ingresar/i }).click();

    await expect(page).toHaveURL(/\/clientes$/);
    await expect(
      page.getByRole("heading", {
        name: /gestión de clientes y mascotas|clientes/i,
      }),
    ).toBeVisible();
  });

  test("muestra error con credenciales inválidas", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/correo electrónico/i).fill("fake@example.com");
    await page.locator("#password").fill("wrong-password");
    await page.getByRole("button", { name: /ingresar/i }).click();

    const inlineError = page.locator(
      "div.rounded-2xl.border.border-red-200.bg-red-50",
    );

    await expect(page).toHaveURL(/\/login$/);
    await expect(inlineError).toBeVisible();
    await expect(inlineError).toContainText(/credenciales inválidas/i);
  });

  test("permite cerrar sesión y vuelve a /login", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/correo electrónico/i).fill(TEST_EMAIL);
    await page.locator("#password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /ingresar/i }).click();

    await expect(page).toHaveURL(/\/clientes$/);

    await page.getByRole("button", { name: /cerrar sesión/i }).click();

    await expect(page).toHaveURL(/\/login$/);
  });

  test("protege /clientes cuando no hay sesión", async ({ page }) => {
    await page.goto("/clientes");

    await expect(page).toHaveURL(/\/login$/);
  });
});
