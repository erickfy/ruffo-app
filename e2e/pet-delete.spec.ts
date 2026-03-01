import { test, expect } from "@playwright/test";

async function openSeedClientDetail(page: import("@playwright/test").Page) {
  await page.goto("/clientes");

  await expect(page).toHaveURL(/\/clientes$/, { timeout: 15000 });

  const searchInput = page.getByRole("textbox", {
    name: /buscar por nombre, teléfono o email/i,
  });

  await searchInput.fill("Carlos Andrade");

  const detailLink = page.getByRole("link", { name: /ver detalle/i });
  await expect(detailLink.first()).toBeVisible({ timeout: 15000 });
  await detailLink.first().click();

  await expect(page).toHaveURL(/\/clientes\/[^/]+$/, { timeout: 15000 });

  const match = page.url().match(/\/clientes\/([^/]+)$/);

  if (!match) {
    throw new Error(
      `No se pudo obtener el id del cliente desde la URL: ${page.url()}`,
    );
  }

  return match[1];
}

function uniqueSuffix() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

test("permite eliminar una mascota desde el detalle del cliente", async ({
  page,
}) => {
  const clientId = await openSeedClientDetail(page);

  const suffix = uniqueSuffix();
  const petName = `Luna Delete ${suffix}`;

  await page.goto(`/clientes/${clientId}/mascotas/nuevo`);

  await expect(page.locator("form")).toBeVisible({ timeout: 15000 });

  const textboxes = page.locator("form").getByRole("textbox");

  await textboxes.nth(0).fill(petName);
  await textboxes.nth(1).fill("Poodle");
  await textboxes.nth(2).fill("Mascota para eliminar");

  await page.getByRole("button", { name: /guardar mascota/i }).click();

  await expect(page).toHaveURL(new RegExp(`/clientes/${clientId}$`), {
    timeout: 15000,
  });

  const petTitle = page.getByRole("heading", { name: petName, exact: true });
  await expect(petTitle).toBeVisible({ timeout: 15000 });

  await page
    .getByRole("button", {
      name: new RegExp(`Eliminar mascota ${petName}`, "i"),
    })
    .click();

  await expect(
    page.getByRole("heading", { name: /^eliminar mascota$/i }),
  ).toBeVisible({ timeout: 15000 });

  await page.getByRole("button", { name: /sí, eliminar/i }).click();

  await expect(
    page.getByRole("heading", { name: petName, exact: true }),
  ).toHaveCount(0, { timeout: 15000 });

  await page.reload();

  await expect(
    page.getByRole("heading", { name: petName, exact: true }),
  ).toHaveCount(0, { timeout: 15000 });
});
