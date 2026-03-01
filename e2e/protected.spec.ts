import { test, expect } from "@playwright/test";

test("usuario autenticado puede entrar a /clientes", async ({ page }) => {
  await page.goto("/clientes");

  await expect(page).toHaveURL(/\/clientes$/);
  await expect(
    page.getByRole("heading", {
      name: /gestión de clientes y mascotas|clientes/i,
    }),
  ).toBeVisible();
});

test("usuario autenticado que visita /login es redirigido a /clientes", async ({
  page,
}) => {
  await page.goto("/login");

  await expect(page).toHaveURL(/\/clientes$/);
});
